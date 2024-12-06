'use client'

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Function to decode the JWT and extract membership
const decodeJWT = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
    return payload.membership; 
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get the token
    const membership = decodeJWT(token); // Decode it to get membership info

    if (membership) {
      setUserType(membership); // Set userType if token exists
    } else {
      setUserType(null); // Clear userType if no token
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    setUserType(null); // Clear the userType from state
  };

  const value = { userType, setUserType, logout }; // Provide logout function

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
