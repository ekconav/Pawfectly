import React from 'react';
import { Dimensions, SafeAreaView, View, Image, TextInput, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // or import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../../const/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import data from '../../const/pets';
import MessagePageShelter from '../MessagePage/MessagePageShelter';
import SettingsPageShelter from '../SettingsPage/SettingsPageShelter';
import Addpet from '../AddPet/AddPet';


const {height} = Dimensions.get('window');

const Card = ({pet, navigation}) => {
  return (
    <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => navigation.navigate('DetailsPageShelter', pet)}>
    <View style={style.cardContainer}>
      {/* Render the card image */}
      <View style={style.cardImageContainer}>
        <Image
          source={pet.image}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
      </View>

      {/* Render all the card details here */}
      <View style={style.cardDetailsContainer}>
        {/* Name and gender icon */}
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Text
            style={{fontWeight: 'bold', color: COLORS.dark, fontSize: 20}}>
            {pet?.name}
          </Text>
          <Icon name="gender-male" size={22} color={COLORS.grey} />
        </View>

        {/* Render the age and type */}
        <Text style={{fontSize: 12, marginTop: 5, color: COLORS.dark}}>
          {pet?.type}
        </Text>
        <Text style={{fontSize: 10, marginTop: 5, color: COLORS.grey}}>
          {pet?.age}
        </Text>

        {/* Render distance and the icon */}
        <View style={{marginTop: 5, flexDirection: 'row'}}>
          <Icon name="map-marker" color={COLORS.primary} size={18} />
          <Text style={{fontSize: 12, color: COLORS.grey, marginLeft: 5}}>
            Distance:7.8km
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);
};

const Tab = createBottomTabNavigator();

const HomeScreenPet = ({navigation}) => {
  
  const [filteredPets, setFilteredPets] = React.useState([]);

  React.useEffect(() => {
    const allPets = data.reduce((acc, category) => {
      acc.push(...category.pets);
      return acc;
    }, []);
    setFilteredPets(allPets);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, color: COLORS.white}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.mainContainer}>
          <Text style={{textAlign: 'center', fontSize: 20}}>LIST OF PETS </Text>
          <View style={style.searchInputContainer}>
            <Icon name="magnify" size={24} color={COLORS.grey} />
            <TextInput
              placeholderTextColor={COLORS.grey}
              placeholder="Search pet to adopt"
              style={{flex: 1}}
            />
            <Icon name="sort-ascending" size={24} color={COLORS.grey} />
          </View>

          <View style={{marginTop: 20}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredPets}
              renderItem={({item}) => (
                <Card pet={item} navigation={navigation} />
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: height,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 7,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBtn: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  categoryBtnName: {
    color: COLORS.dark,
    fontSize: 10,
    marginTop: 5,
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardDetailsContainer: {
    height: 120,
    backgroundColor: COLORS.white,
    flex: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 20,
    justifyContent: 'center',
  },
  cardImageContainer: {
    height: 150,
    width: 140,
    backgroundColor: COLORS.background,
    borderRadius: 20,
  },
});


const HomePageScreenShelter = () => (
  <Tab.Navigator>
    <Tab.Screen 
      name="Home" 
      component={HomeScreenPet} 
      options={{ 
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="paw-outline" color={color} size={size} />
        ),
        headerShown: false, 
        tabBarLabel: 'Home'
      }}
    />
    <Tab.Screen
      name='Add'
      component={Addpet}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle-outline" color={color} size={size} />
        ),
        headerShown: false,
        tabBarLabel: 'Add Pet'
        }}
    />

      <Tab.Screen
        name='Message'
        component={MessagePageShelter}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" color={color} size={size} />
            ),
          headerShown: false, 
          tabBarLabel: 'Message'}} 
          />
          
      <Tab.Screen 
      name="Settings" 
      component={SettingsPageShelter} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        headerShown: false, 
        tabBarLabel: 'Settings'}} />
  </Tab.Navigator>
);


export default HomePageScreenShelter