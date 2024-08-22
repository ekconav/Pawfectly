import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    paddingTop: 20,
    paddingHorizontal: 25,
  },
  mainContainer: {
    flex: 1,
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
  loadingContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    padding: 5,
    marginBottom: 15,
    borderRadius: 20,
  },
  petButton: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 4,
  },
  petContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderColor: COLORS.outline,
    borderWidth: 0.5,
  },
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: COLORS.title,
  },
  petImage: {
    width: "100%",
    height: 230,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
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
  genderIconContainer: {
    right: 50,
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
  iconAddress: {
    flexDirection: "row",
    alignItems: "center",
  },
  petAddress: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  noResultsText: {
    color: COLORS.black,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },
  categoriesTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: COLORS.title,
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButtonContainer: {
    flexDirection: "row",
    gap: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 7,
    paddingHorizontal: 10,
    borderRadius: 50,
    elevation: 1,
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
  refreshControl: {
    backgroundColor: COLORS.white,
  },
});

export default styles;
