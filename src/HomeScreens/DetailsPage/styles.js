import { StyleSheet } from 'react-native';
import COLORS from '../../const/colors';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 300, // Adjust the height as needed
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  petName: {
    fontSize: 30,
    color: COLORS.dark,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  petDescription: {
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 10,
  },
  petBreed: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  petDetail: {
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: COLORS.grey,
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5, // Add margin between buttons
  },
  adoptionButton: {
    backgroundColor: COLORS.primary,
    padding: 40,
  },
  favoriteButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;

