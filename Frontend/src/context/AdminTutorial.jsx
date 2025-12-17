import { createContext, useState } from 'react';
import axios from "axios";


export const AdminTutorialDataContext = createContext();

const AdminTutorialsContext = ({ children }) => {
  const [admintutorial, setAdminTutorial] = useState([]);

//    Function to fetch AdminTutorial profile
  const fetchAdminTutorialProfile = async () => {
    try {
          const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/admin/all-tutorial`,
                { withCredentials: true }
            );


      if (!response.data.success) throw new Error('Failed to fetch AdminTutorial');
      const data = response.data.alltutorial;
      setAdminTutorial(data);
    } catch (error) {
      console.error('Error fetching AdminTutorial');
    }
  };

  // Fetch AdminTutorial profile on component mount (page reload)




  return (
    <AdminTutorialDataContext.Provider value={{admintutorial, setAdminTutorial, fetchAdminTutorialProfile }}>
      {children}
    </AdminTutorialDataContext.Provider>
  );
};

export default AdminTutorialsContext;






 
