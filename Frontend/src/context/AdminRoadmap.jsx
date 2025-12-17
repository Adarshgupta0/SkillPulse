import { createContext, useState } from 'react';
import axios from "axios";


export const AdminRoadmapDataContext = createContext();

const AdminRoadmapsContext = ({ children }) => {
  const [adminroadmap, setAdminRoadmap] = useState([]);

//    Function to fetch AdminRoadmap profile
  const fetchAdminRoadmapProfile = async () => {
    try {
          const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/admin/all-roadmap`,
                { withCredentials: true }
            );


      if (!response.data.success) throw new Error('Failed to fetch AdminRoadmap');
      const data = response.data.allroadmaps;
      setAdminRoadmap(data);
    } catch (error) {
      console.error('Error fetching Roadmap');
    }
  };

  // Fetch Roadmap profile on component mount (page reload)




  return (
    <AdminRoadmapDataContext.Provider value={{ adminroadmap, setAdminRoadmap, fetchAdminRoadmapProfile }}>
      {children}
    </AdminRoadmapDataContext.Provider>
  );
};

export default AdminRoadmapsContext;






 
