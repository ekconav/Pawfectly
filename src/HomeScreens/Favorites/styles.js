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
  pageTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: COLORS.title,
    textAlign: "center",
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
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: COLORS.title,
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
  petAddress: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  iconAddress: {
    flexDirection: "row",
    alignItems: "center",
  },
  noTextContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
  },
  noFavoritesText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    color: COLORS.title,
  },
  deleteButton: {
    backgroundColor: COLORS.delete,
    width: 50,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  deleteIcon: {
    color: COLORS.white,
  },
});

export default styles;
