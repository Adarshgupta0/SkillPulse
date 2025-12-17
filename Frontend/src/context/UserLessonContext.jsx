import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";


export const LessonDataContext = createContext();

const LessonsContext = ({ children }) => {
  const [lesson, setLesson] = useState([]);

//    Function to fetch Lesson profile
  const fetchlessonProfile = async () => {
    try {
          const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/lesson`,
                { withCredentials: true }
            );


      if (!response.data.success) throw new Error('Failed to fetch lesson');
      const data = response.data.lessons;
      setLesson(data);
    } catch (error) {
      console.error('Error fetching Lesson');
    }
  };

  // Fetch Lesson profile on component mount (page reload)
 



  return (
    <LessonDataContext.Provider value={{ lesson, setLesson, fetchlessonProfile }}>
      {children}
    </LessonDataContext.Provider>
  );
};

export default LessonsContext;






 
