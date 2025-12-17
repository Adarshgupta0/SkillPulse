import React, { useEffect } from 'react';
import { useContext } from "react";
import { UserDataContext } from "../../context/Usercontext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {

    const { setUser } = useContext(UserDataContext);

    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, { withCredentials: true });

                if (response.data.success) {

                    setUser({
                        email: '',
                        name: '',
                        userCategory: '',
                    });
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error during logout");
            }
        };

        logoutUser();
    }, [navigate]); // Empty array ensures this runs only once when component mounts.

    return (
        <div>UserLogout</div>
    );
}

export default Logout
