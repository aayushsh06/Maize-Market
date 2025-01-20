import React from 'react'
import { createContext, useState, useEffect } from 'react';
import { auth } from '../api/Firebase-config.js';

const UserContext = createContext(null);

const UserProvider = ({children}) => {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [isAuthenticated, setAuthentication] = useState(false);

    useEffect(() => {
        // Check auth state on mount
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user && user.emailVerified) {
                setAuthentication(true);
                setEmail(localStorage.getItem('email'));
                setUsername(localStorage.getItem('username'));
            } else {
                setAuthentication(false);
                setEmail(null);
                setUsername(null);
                // Clear localStorage
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                localStorage.removeItem('isAuthenticated');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ username, setUsername, isAuthenticated, setAuthentication, email, setEmail }}>
            {children}
        </UserContext.Provider>
    );
}

export {UserContext, UserProvider};
