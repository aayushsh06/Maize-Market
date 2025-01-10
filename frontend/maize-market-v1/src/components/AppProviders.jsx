import React from 'react'
import { UserProvider } from './UserContext.jsx';

const AppProviders = ({children}) => {
  return (
    <UserProvider>
        {children}
    </UserProvider>
  )
}

export default AppProviders;
