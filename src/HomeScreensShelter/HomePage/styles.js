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
    height: 210,
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
  petNameGenderSeeAll: {
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ageContainerSeeAll: {
    paddingHorizontal: 3,
    justifyContent: "space-between",
  },
  ageText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  ageTextSeeAll: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
    fontSize: 10,
  },
  ready: {
    color: COLORS.white,
    backgroundColor: COLORS.prim,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
  readySeeAll: {
    color: COLORS.white,
    backgroundColor: COLORS.prim,
    paddingHorizontal: 5,
    borderRadius: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 8,
    textAlign: "center",
  },
  notReady: {
    color: COLORS.white,
    backgroundColor: COLORS.subtitle,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
  notReadySeeAll: {
    color: COLORS.white,
    backgroundColor: COLORS.subtitle,
    paddingHorizontal: 5,
    borderRadius: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 8,
    textAlign: "center",
  },
  seeAllText: {
    color: COLORS.title,
    fontFamily: "Poppins_500Medium",
  },

  // Alert Modal
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

  // Terms Modal
  termsModalVisible: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  updateTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginBottom: 10,
  },
  updateText: {
    fontFamily: "Poppins_500Medium",
    marginBottom: 20,
  },
  updateLink: {
    color: COLORS.link,
  },
  updateCheckboxContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  checkboxText: {
    fontFamily: "Poppins_600SemiBold",
  },
  updateButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  updateCancelButton: {
    backgroundColor: COLORS.subtitle,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 90,
    borderRadius: 5,
  },
  updateCancelButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  updateConfirmButton: {
    backgroundColor: COLORS.prim,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 90,
    borderRadius: 5,
  },
  updateConfirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },

  TOSTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    marginBottom: 20,
  },
  tosScrollView: {
    maxHeight: 600,
    marginBottom: 20,
  },
  tosContainer: {
    marginBottom: 10,
  },
  tosTitle: {
    fontFamily: "Poppins_600SemiBold",
  },
  tosDescription: {
    fontFamily: "Poppins_400Regular",
    textAlign: "justify",
    paddingLeft: 15,
  },
  tosEmail: {
    color: COLORS.prim,
    fontFamily: "Poppins_500Medium",
  },

  // For App
  icons: {
    marginBottom: -8,
  },
  counter: {
    position: "absolute",
    right: -6,
    top: -5,
    backgroundColor: COLORS.prim,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
});

export default styles;
