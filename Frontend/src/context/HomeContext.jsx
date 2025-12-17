import { createContext, useState } from 'react';
import axios from "axios";

export const HomeDataContext = createContext();

const HomesContext = ({ children }) => {
    const [home, setHome] = useState({
        lessons: [],
        tutorials: [],
        roadmaps: [],
    });

    //    Function to fetch Home profile
    const fetchHomeProfile = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/home`,
                { withCredentials: true }
            );
            const data = response.data;
            setHome({
                lessons: data.lessons || [],
                tutorials: data.tutorials || [],
                roadmaps: data.roadmaps || [],
            });
        } catch (error) {
            console.error('Error fetching Home profile');
        }
    };

    return (
        <HomeDataContext.Provider value={{ home, setHome, fetchHomeProfile }}>
            {children}
        </HomeDataContext.Provider>
    );
};

export default HomesContext;







