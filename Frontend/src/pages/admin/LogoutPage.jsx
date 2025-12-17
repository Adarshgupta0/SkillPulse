import React, { useEffect } from 'react';
import { useContext } from "react";
import { AdminDataContext } from "../../context/Admincontext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutAdmin = () => {


    const navigate = useNavigate();

    const { setAdmin } = useContext(AdminDataContext);


    useEffect(() => {
        const logoutUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/logout`, { withCredentials: true });

                if (response.data.success) {

                    setAdmin({
                        name: '',
                        email: '',
                    });
                    navigate('/admin/login');
                }
            } catch (error) {
                console.error("Error during logout");
            }
        };

        logoutUser();
    }, [navigate]); // Empty array ensures this runs only once when component mounts.

    return (
        <div>Logout Admin</div>
    );
}

export default LogoutAdmin
