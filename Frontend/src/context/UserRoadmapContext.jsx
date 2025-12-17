import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";


export const RoadmapDataContext = createContext();

const RoadmapsContext = ({ children }) => {
  const [roadmap, setRoadmap] = useState([]);

//    Function to fetch Roadmap profile
  const fetchRoadmapProfile = async () => {
    try {
          const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/roadmap`,
                { withCredentials: true }
            );


      if (!response.data.success) throw new Error('Failed to fetch Roadmap');
      const data = response.data.roadmap;
      setRoadmap(data);
    } catch (error) {
      console.error('Error fetching Roadmap');
    }
  };

  // Fetch Roadmap profile on component mount (page reload)
 



  return (
    <RoadmapDataContext.Provider value={{ roadmap, setRoadmap, fetchRoadmapProfile }}>
      {children}
    </RoadmapDataContext.Provider>
  );
};

export default RoadmapsContext;






 
