'use client'

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { NavBarFree } from './NavBarFree';
import { NavBarPrem } from './NavBarPrem';
import { NavBar } from './NavBar';

const NavBarWrapper = () => {
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const logout = () => {
    localStorage.removeItem('token');  // Remove token from localStorage
    setUserType(null);  // Reset userType to null, will trigger a re-render
    window.location.href = '/login';  // Redirect to login page
  };  

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve JWT from localStorage
  
    if (token) {
      const decodedToken = decodeJWT(token);
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        // Check if token is still valid
        setUserType(decodedToken.membership);
      } else {
        // Token expired or invalid, log out the user
        logout();
      }
    }
    
    setIsLoading(false); // Stop loading once the check is done
  }, [userType]);  

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state while checking user type
  }

  if (userType === 'premium') return <NavBarPrem logout={logout} />;
  if (userType === 'free') return <NavBarFree logout={logout} />;
  return <NavBar />;
};

const decodeJWT = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    return payload;  // Ensure you are getting the correct structure of the token
  } catch (error) {
    return null; // Return null if token is invalid
  }
};

export default NavBarWrapper;
