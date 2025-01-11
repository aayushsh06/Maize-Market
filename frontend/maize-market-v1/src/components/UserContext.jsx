import React from 'react'
import { createContext, useState} from 'react';

const UserContext = createContext(null);

const UserProvider = ({children}) => {
    const [username, setUsername] = useState('');
    const [isAuthenticated, setAuthentication] = useState('');
    const [userEmail, setUserEmail] = useState('')
    return (
        <UserContext.Provider value={{ username, setUsername, isAuthenticated, setAuthentication }}>
          {children}
        </UserContext.Provider>
      );
}

export {UserContext, UserProvider};
