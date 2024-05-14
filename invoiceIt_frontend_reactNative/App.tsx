// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider, useUser } from './UserContext'; // Import the context provider and hook

import LoginScreen from './app/screens/auth/LoginScreen';
import SignUpScreen from './app/screens/auth/SignUpScreen';
import HomeScreen from './app/screens/tabs/HomeScreen';
import InventoryScreen from './app/screens/tabs/InventoryScreen';
import UploadScreen from './app/screens/tabs/UploadScreen';
import AccountScreen from './app/screens/tabs/AccountScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();
const OutsideStack = createNativeStackNavigator();
const InsideDrawer = createDrawerNavigator();

function OutsideLayout() {
  return (
    <OutsideStack.Navigator>
      <OutsideStack.Screen name="Login" component={LoginScreen} />
      <OutsideStack.Screen name="SignUp" component={SignUpScreen} />
    </OutsideStack.Navigator>
  );
}

function InsideLayout() {
  return (
    <InsideDrawer.Navigator>
      <InsideDrawer.Screen name="Home" component={HomeScreen} />
      <InsideDrawer.Screen name="Inventory" component={InventoryScreen} />
      <InsideDrawer.Screen name="Upload" component={UploadScreen} />
      <InsideDrawer.Screen name="Account" component={AccountScreen} />
    </InsideDrawer.Navigator>
  );
}

function AppNavigation() {
  const { user } = useUser(); // Use the useUser hook to access the user

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Outside" component={OutsideLayout} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppNavigation /> {/* This component handles the navigation logic based on authentication state */}
    </UserProvider>
  );
}



