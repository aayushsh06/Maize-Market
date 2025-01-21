import React from 'react'
import { createContext, useState, useEffect } from 'react';
import { auth } from '../api/Firebase-config.js';

const UserContext = createContext(null);

const UserProvider = ({children}) => {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [isAuthenticated, setAuthentication] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check auth state on mount
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser && currentUser.emailVerified) {
                setAuthentication(true);
                setEmail(localStorage.getItem('email'));
                setUsername(localStorage.getItem('username'));
                setUser(currentUser);
            } else {
                setAuthentication(false);
                setEmail(null);
                setUsername(null);
                setUser(null);
                // Clear localStorage
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                localStorage.removeItem('isAuthenticated');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ 
            username, 
            setUsername, 
            isAuthenticated, 
            setAuthentication, 
            email, 
            setEmail,
            user
        }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };
