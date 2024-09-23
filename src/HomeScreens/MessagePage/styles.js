import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: COLORS.outline,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    color: COLORS.title,
  },
  callButton: {
    alignItems: "flex-end",
  },
  messagesContainer: {
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.sentMessage,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.receivedMessage,
  },
  sentMessageText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.white,
    fontSize: 13,
  },
  receivedMessageText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.black,
    fontSize: 13,
  },
  messageImage: {
    marginVertical: -10,
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  receivedMessageTime: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: COLORS.title,
  },
  sendMessageTime: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: COLORS.sentDateTime,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.outline,
    backgroundColor: COLORS.white,
    position: "relative",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    paddingRight: 50,
    backgroundColor: COLORS.white,
    fontFamily: "Poppins_400Regular",
  },
  sendButton: {
    backgroundColor: COLORS.white,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  imageIcon: {
    position: "absolute",
    right: 80,
    top: 18,
  },
  shelterAccountPictureHeader: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 10,
  },
  shelterProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  userProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  receiveMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  sendMessageContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
  },
  mainMessageContainer: {
    paddingHorizontal: 8,
  },
  shelterExist: {
    padding: 15,
    backgroundColor: COLORS.subtitle,
    alignItems: "center",
  },
  shelterExistText: {
    color: COLORS.white,
    fontFamily: "Poppins_400Regular",
  },
  petAdoptedContainer: {
    padding: 8,
    borderBottomColor: COLORS.outline,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  petAdoptedText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    paddingHorizontal: 8,
    paddingVertical: 5,
    color: COLORS.title,
    flexWrap: "wrap",
  },
  subHeader: {
    padding: 8,
    borderBottomColor: COLORS.outline,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  subHeaderText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    paddingHorizontal: 8,
    paddingVertical: 5,
    color: COLORS.title,
    flexWrap: "wrap",
  },
  approveButton: {
    backgroundColor: COLORS.prim,
    padding: 8,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
  },
  approveText: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.white,
  },

  // Modal
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
