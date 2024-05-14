import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth } from './firebase-config';
import axios from './axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if(user) {
        const { email } = user
        try {
          const response = await axios.get(`/users/${email}`);
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null)
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  const setUser = (user) => {
      setCurrentUser(user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}


