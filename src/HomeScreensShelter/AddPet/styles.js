import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    addPhoto: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        marginBottom: 10,
    },
    addPhotoText: {
        marginTop: 5,
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 10,
    },
    form: {
        marginBottom: 20,
    },
    inputField: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
    },
    dropdownButtonText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '80%',
        width: '80%',
    },
    breedOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    uploadButton: {
        backgroundColor: 'blue',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default styles;
