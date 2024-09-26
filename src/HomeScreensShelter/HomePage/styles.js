import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    paddingTop: 20,
    paddingHorizontal: 25,
  },
  loadingContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  accountName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
    marginTop: 5,
    color: COLORS.title,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoriesTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: COLORS.title,
  },
  categoryChoices: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 7,
    paddingHorizontal: 10,
    borderRadius: 50,
    elevation: 2,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    marginLeft: -1,
  },
  categoryName: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: COLORS.title,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  noResultsText: {
    color: COLORS.title,
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
  },
  mainContainer: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonContainerSeeAll: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  petButton: {
    borderRadius: 10,
    elevation: 2,
  },
  petButtonSeeAll: {
    elevation: 2,
    width: 135,
    height: 200,
  },
  petContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderColor: COLORS.outline,
    borderWidth: 0.5,
  },
  imageContainer: {
    width: "100%",
    paddingHorizontal: 10,
    height: 230,
    marginBottom: 10,
    marginTop: 10,
    alignContent: "center",
    overflow: "hidden",
  },
  imageContainerSeeAll: {
    width: "100%",
    paddingHorizontal: 10,
    height: 130,
    marginBottom: 10,
    marginTop: 10,
    alignContent: "center",
    overflow: "hidden",
  },
  petImage: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  petDetails: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  petNameGender: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 7,
    alignItems: "center",
  },
  petNameGenderSeeAll:{ 
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 3,
    alignItems: "center",
  },
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: COLORS.title,
  },
  petNameSeeAll: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: COLORS.title,
  },
  petGenderIconMale: {
    backgroundColor: COLORS.malegenderbg,
    padding: 5,
    borderRadius: 50,
  },
  petGenderIconFemale: {
    backgroundColor: COLORS.femalegenderbg,
    padding: 5,
    borderRadius: 50,
  },
  ageContainer: {
    paddingHorizontal: 7,
  },
  ageText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  seeAllText: {
    color: COLORS.title,
    fontFamily: "Poppins_500Medium",
  },
});

export default styles;
