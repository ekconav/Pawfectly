import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsDrawer: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingTitle: {
    marginLeft: 10,
    fontSize: 16,
  },
});
