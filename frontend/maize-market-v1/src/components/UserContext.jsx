import React from 'react'
import { createContext, useState} from 'react';

const UserContext = createContext(null);

const UserProvider = ({children}) => {
    const [username, setUsername] = useState('');
    const [isAuthenticated, setAuthentication] = useState(false);
    const [email, setEmail] = useState('')
    return (
        <UserContext.Provider value={{ username, setUsername, isAuthenticated, setAuthentication, email, setEmail }}>
          {children}
        </UserContext.Provider>
      );
}

export {UserContext, UserProvider};
