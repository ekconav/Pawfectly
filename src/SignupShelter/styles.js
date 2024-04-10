import { StyleSheet } from 'react-native';
import COLORS from '../const/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    marginRight: 10,
  },
  mobileNumberInput: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 8,
  },
  emailSuffix: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: COLORS.red,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  }
});

export default styles;
