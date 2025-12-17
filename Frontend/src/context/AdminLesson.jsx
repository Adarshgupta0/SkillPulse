import { createContext, useState } from 'react';
import axios from "axios";


export const AdminLessonDataContext = createContext();

const AdminLessonsContext = ({ children }) => {
  const [adminaesson, setAdminLesson] = useState([]);

//    Function to fetch AdminLesson profile
  const fetchAdminLessonProfile = async () => {
    try {
          const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/admin/all-lessons`,
                { withCredentials: true }
            );


      if (!response.data.success) throw new Error('Failed to fetch AdminLesson');
      const data = response.data.lessons;
      setAdminLesson(data);
    } catch (error) {
      console.error('Error fetching AdminLesson');
    }
  };

  // Fetch AdminLesson profile on component mount (page reload)
 


  return (
    <AdminLessonDataContext.Provider value={{ adminaesson, setAdminLesson, fetchAdminLessonProfile }}>
      {children}
    </AdminLessonDataContext.Provider>
  );
};

export default AdminLessonsContext;






 
