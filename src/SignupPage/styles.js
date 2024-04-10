import { StyleSheet } from 'react-native';
import COLORS from '../const/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 8,
    width: '100%',
  },
  inputContainer: {
    width: '100%',
  },
  mobileInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
  },
  countryCode: {
    marginRight: 10,
  },
  mobileNumberInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
  },
  emailInput: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: 'white',
    fontSize: 16,
  },
});

export default styles;
