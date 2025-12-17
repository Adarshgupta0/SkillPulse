import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";


export const AdminUserDataContext = createContext();

const AdminUserContext = ({ children }) => {
  const [adminuser, setAdminUser] = useState([]);

//    Function to fetch user profile
  const fetchAdminUserProfile = async () => {
    try {
          const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/admin/all-users`,
                { withCredentials: true }
            );


      if (!response.data.success) throw new Error('Failed to fetch adminuser');
      const data = response.data.allusers;
      setAdminUser(data);
    } catch (error) {
      console.error('Error fetching Admin profile');
    }
  };

  // Fetch AdminUser profile on component mount (page reload)




  return (
    <AdminUserDataContext.Provider value={{ adminuser, setAdminUser, fetchAdminUserProfile }}>
      {children}
    </AdminUserDataContext.Provider>
  );
};

export default AdminUserContext;






 
