import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//login screens link
import LandingPage from './src/LandingPage/LandingPage';
import LoginPage from './src/Loginpage/LoginPage';
import SignupPage from './src/SignupPage/signuppage';
import ChoosePage from './src/ChoosePage/ChoosePage';
import SignupShelter from './src/SignupShelter/SignupShelter';
import ChooseLogin from './src/ChooseLogin/ChooseLogin';
import LoginPageShelter from './src/LoginPageShelter/LoginPageShelter';

//homepage screens link
import HomeScreen from './src/HomeScreens/HomePage/HomeScreen';
import useAuth from './hooks/useAuth'
import DetailsPage from './src/HomeScreens/DetailsPage/DetailsPage';
import FavoritesPage from './src/HomeScreens/Favorites/FavoritesPage';



const Stack = createStackNavigator();


const App = () => {
  const { user } = useAuth(); // Get user information using useAuth hoo
  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='HomeScreen'screenOptions={{ headerShown: false }}>
          <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown: false}}/>  
          <Stack.Screen name='DetailsPage' component={DetailsPage} options={{headerShown: false}}/> 
          <Stack.Screen name='FavoritesPaage' component={FavoritesPage} options={{headerShown: false}}/> 
        </Stack.Navigator>
        </NavigationContainer>
      )
  } else {
    return ( 
      <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginScreens'screenOptions={{ headerShown: false }}>
        <Stack.Screen name='LandingPage' component={LandingPage} options={{ headerShown: false }} />
        <Stack.Screen name='LoginPage' component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name='SignupPage' component={SignupPage} options={{ headerShown: false }} />
        <Stack.Screen name="ChoosePage" component={ChoosePage} options={{ headerShown: false }} />
        <Stack.Screen name='ChooseLogin' component={ChooseLogin} options={{headerShown: false}} />
      </Stack.Navigator>
      </NavigationContainer>   
    );
  }
};

export default App;
