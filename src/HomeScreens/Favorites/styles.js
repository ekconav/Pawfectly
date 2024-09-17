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
  buttonContainer: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 20,
  },
  petButton: {
    borderRadius: 10,
    elevation: 2,
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
    width: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  deleteIcon: {
    color: COLORS.white,
  },
});

export default styles;
