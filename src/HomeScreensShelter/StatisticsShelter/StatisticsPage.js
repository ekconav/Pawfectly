import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { db, auth } from "../../FirebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import styles from "./styles";
import COLORS from "../../const/colors";

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = () => {
      const user = auth.currentUser;
      if (user) {
        const statsRef = doc(db, "shelters", user.uid, "statistics", user.uid);
        const unsubscribe = onSnapshot(
          statsRef,
          (statsSnap) => {
            if (statsSnap.exists()) {
              setStats(statsSnap.data());
            } else {
              console.log("No stats found!");
              setStats(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching stats:", error);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } else {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.prim} />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.noStatsAvailable}>
        <Text style={styles.noStatsText}>No statistics available</Text>
      </View>
    );
  }

  const chartData = [
    {
      name: "Pets for Adoption",
      population: stats.petsForAdoption || 0,
      color: COLORS.pie1,
      legendFontColor: COLORS.black,
      legendFontSize: 15,
    },
    {
      name: "Pets Adopted",
      population: stats.petsAdopted || 0,
      color: COLORS.pie2,
      legendFontColor: COLORS.black,
      legendFontSize: 15,
    },
    {
      name: "Pets Rescued",
      population: stats.petsRescued || 0,
      color: COLORS.pie3,
      legendFontColor: COLORS.black,
      legendFontSize: 15,
    },
  ].filter((item) => item.population > 0); // Filter out zero populations to avoid empty segments

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>Shelter Statistics</Text>
        <View style={styles.chart}>
          <PieChart
            hasLegend={false}
            data={chartData}
            width={Dimensions.get("window").width - 140} // Chart width, adjust as needed
            height={250}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="51"
          />
        </View>

        <View style={styles.legendContainer}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColorBox,
                  { backgroundColor: item.color, borderRadius: 50 },
                ]}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "90%",
                }}
              >
                <Text style={styles.legendTitle}>{item.name}: </Text>
                <Text style={styles.legendsResult}>{item.population}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default StatisticsPage;
