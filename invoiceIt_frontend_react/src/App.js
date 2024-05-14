import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './AuthContext';

import PrivateRoute from './components/PrivateRoute';
import DrawerNavigation from './components/DrawerNavigation';

import Login from './screens/auth/LoginScreen';
import SignUp from './screens/auth/SignUpScreen';
import HomeScreen  from './screens/tabs/HomeScreen';
import InventoryScreen from './screens/tabs/InventoryScreen';
import UploadScreen from './screens/tabs/UploadScreen';
import ProfileScreen from './screens/tabs/ProfileScreen';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<PrivateRoute><DrawerNavigation /></PrivateRoute>}>
            <Route index element={<HomeScreen />} />
            <Route path='inventory' element={<InventoryScreen />} />
            <Route path='upload' element={<UploadScreen />} />
            <Route path='profile' element={<ProfileScreen />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
