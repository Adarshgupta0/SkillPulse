import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";


export const TutorialDataContext = createContext();

const TutorialsContext = ({ children }) => {
  const [tutorial, setTutorial] = useState([]);

  //    Function to fetch Tutorial profile
  const fetchTutorialProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/tutorial`,
        { withCredentials: true }
      );


      if (!response.data.success) throw new Error('Failed to fetch Tutorial');
      const data = response.data.tutorial;
      setTutorial(data);
    } catch (error) {
      console.error('Error fetching Tutorial');
    }
  };

  // Fetch Tutorial profile on component mount (page reload)
 



  return (
    <TutorialDataContext.Provider value={{ tutorial, setTutorial, fetchTutorialProfile }}>
      {children}
    </TutorialDataContext.Provider>
  );
};

export default TutorialsContext;







