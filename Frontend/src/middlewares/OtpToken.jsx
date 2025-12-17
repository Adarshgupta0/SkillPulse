import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpToken = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/check-otp-token`, { withCredentials: true }
                );
                if (response.data.success) {
                  
                }
            } catch (error) {
             
                navigate('/login');
            }
        };
        checkAuth();
    }, [navigate]);

    return <>{children}</>;
}

export default OtpToken