import { StyleSheet } from 'react-native';
import COLORS from '../const/colors';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.primary,
    paddingBottom: 40,
    fontFamily: '' ,

  },
  imageContainer: {
    alignItems: 'center',
   
  },
  image: {
    width: 320,
    height: 320,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.dark,
    paddingTop: 50,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
});

export default styles;
