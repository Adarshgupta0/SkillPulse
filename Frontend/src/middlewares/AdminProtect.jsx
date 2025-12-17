import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ------------------ Protect ------------------
export const ProtectAdmin = ({ children }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/admin/auth-check`,
                    { withCredentials: true }
                );

                if (!response.data.success) {
                    navigate('/admin');
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                navigate('/admin/login');
            }
        };

        checkAuth();
    }, [navigate]);

    if (isLoading) return <div className="text-center">Loading...</div>;

    return <>{children}</>;
};

// ------------------ ChangePassToken ------------------
export const ChangePassTokenAdmin = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/admin/check-changepassword-token`,
                    { withCredentials: true }
                );
                if (!response.data.success) {
                    navigate('/admin/resetpassword');
                }
            } catch (error) {
                navigate('/admin/login');
            }
        };

        checkAuth();
    }, [navigate]);

    return <>{children}</>;
};

// ------------------ OtpToken ------------------
export const OtpTokenAdmin = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/admin/check-otp-token`,
                    { withCredentials: true }
                );
                if (!response.data.success) {
                    navigate('/admin/otpvarify');
                }
            } catch (error) {
                navigate('/admin/login');
            }
        };

        checkAuth();
    }, [navigate]);

    return <>{children}</>;
};
