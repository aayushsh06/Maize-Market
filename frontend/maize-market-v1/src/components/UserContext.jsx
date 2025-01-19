import React from 'react'
import { createContext, useState, useEffect} from 'react';

const UserContext = createContext(null);

const UserProvider = ({children}) => {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [isAuthenticated, setAuthentication] = useState(localStorage.getItem('isAuthenticated'));


    return (
        <UserContext.Provider value={{ username, setUsername, isAuthenticated, setAuthentication, email, setEmail }}>
          {children}
        </UserContext.Provider>
      );
}

export {UserContext, UserProvider};
