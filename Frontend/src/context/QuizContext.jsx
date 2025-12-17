import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";


export const QuizDataContext = createContext();

const QuizsContext = ({ children }) => {
  const [quiz, setQuiz] = useState([]);

//    Function to fetch Quiz profile
  const fetchQuizProfile = async () => {
    try {
          const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/quiz`,
                { withCredentials: true }
            );


      if (!response.data.success) throw new Error('Failed to fetch Quiz');
      const data = response.data.quizes;
      setQuiz(data);
    } catch (error) {
      console.error('Error fetching Quiz ');
    }
  };

  // Fetch Quiz profile on component mount (page reload)




  return (
    <QuizDataContext.Provider value={{ quiz, setQuiz, fetchQuizProfile }}>
      {children}
    </QuizDataContext.Provider>
  );
};

export default QuizsContext;






 
