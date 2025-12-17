import { createContext, useState, useEffect } from 'react';
import axios from "axios";


export const AdminDataContext = createContext();

const AdminsContext = ({ children }) => {
  const [admin, setAdmin] = useState({
    email: '',
    name: '',
  });

//    Function to fetch admin profile
  const fetchadminProfile = async () => {
    try {
          const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/admin/profile`,
                { withCredentials: true }
            );


      if (!response.data.success) throw new Error('Failed to fetch profile');
      const data = response.data.admin;
      setAdmin({
        email: data.email || '',
        name: data.name || '',
      });
    } catch (error) {
      console.error('Error fetching admin profile');
    }
  };

  // Fetch admin profile on component mount (page reload)
  useEffect(() => {
    fetchadminProfile();
  }, []);



  return (
    <AdminDataContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export default AdminsContext;






 
