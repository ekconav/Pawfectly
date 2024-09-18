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
    paddingHorizontal: 5,
    paddingVertical: 10,
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
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: COLORS.title,
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
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  noResultsText: {
    color: COLORS.title,
    fontFamily: "Poppins_500Medium",
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
    gap: 8,
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
  refreshControl: {
    backgroundColor: COLORS.white,
  },

  // Adopter Container
  adopterContainer: {
    backgroundColor: COLORS.prim,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  adopterText: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.white,
    flexWrap: "wrap",
  },
  adopterButton: {
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  adopterButtonText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.prim,
  },
  adopterImage: {
    width: 120,
    height: 120,
  },

  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  modalButtonContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  modalText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
  },
  modalButton: {
    backgroundColor: COLORS.prim,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: COLORS.white,
    fontFamily: "Poppins_400Regular",
  },
});

export default styles;
