import { createContext, useState } from 'react';
import axios from "axios";


export const AdminQuizDataContext = createContext();

const AdminQuizsContext = ({ children }) => {
  const [adminquiz, setAdminQuiz] = useState([]);

//    Function to fetch AdminQuiz profile
  const fetchAdminQuizProfile = async () => {
    try {
          const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/admin/all-quizzes`,
                { withCredentials: true }
            );


      if (!response.data.success) throw new Error('Failed to fetch AdminQuiz');
      const data = response.data.allquizs;
      setAdminQuiz(data);
    } catch (error) {
      console.error('Error fetching AdminQuiz');
    }
  };





  return (
    <AdminQuizDataContext.Provider value={{ adminquiz, setAdminQuiz, fetchAdminQuizProfile }}>
      {children}
    </AdminQuizDataContext.Provider>
  );
};

export default AdminQuizsContext;






 
