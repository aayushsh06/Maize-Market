import React from 'react'
import { createContext, useState} from 'react';

const UserContext = createContext(null);

const UserProvider = ({children}) => {
    const [username, setUsername] = useState(null);
    const [isAuthenticated, setAuthentication] = useState(false);
    return (
        <UserContext.Provider value={{ username, setUsername, isAuthenticated, setAuthentication }}>
          {children}
        </UserContext.Provider>
      );
}

export {UserContext, UserProvider};
