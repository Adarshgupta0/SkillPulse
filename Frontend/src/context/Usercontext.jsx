import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";


export const UserDataContext = createContext();

const UsersContext = ({ children }) => {
  const [user, setUser] = useState({
    email: '',
    name: '',
    userCategory: '', 
  });

//    Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
          const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/profile`,
                { withCredentials: true }
            );


      if (!response.data.success) throw new Error('Failed to fetch profile');
      const data = response.data.user;
      setUser({
        email: data.email || '',
        name: data.name || '',
        userCategory: data.userCategory || '',
      });
    } catch (error) {
      console.error('Error fetching user profile');
    }
  };

  // Fetch user profile on component mount (page reload)
  useEffect(() => {
    fetchUserProfile();
  }, []);



  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UsersContext;






 
