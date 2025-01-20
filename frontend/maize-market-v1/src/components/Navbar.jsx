import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import { UserContext } from './UserContext.jsx';
import { auth } from '../api/Firebase-config.js';
import Notification from './Notification.jsx';

const Navbar = ({toggleModal}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(UserContext);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isVerificationNotice, setIsVerificationNotice] = useState(false);

  const handleHomeClick = () => {
    navigate("/home");
  }
  const handleAddClick = () => {
    const currentUser = auth.currentUser;
    
    if (!isAuthenticated) {
      setIsVerificationNotice(false);
      setNotificationMessage("You need to be logged in to add products. Please sign in or create an account.");
      setShowNotification(true);
    } else if (currentUser && !currentUser.emailVerified) {
      setIsVerificationNotice(true);
      setNotificationMessage("Please verify your email before adding products. Check your inbox for the verification link.");
      setShowNotification(true);
    } else {
      navigate("/products/add");
    }
  }
  const handleUserClick = () => {
    navigate("/login");
  }
  const handleProductsClick = () => {
    navigate("/products");
  }

  const handleNotificationAction = () => {
    setShowNotification(false);
    if (!isAuthenticated) {
      navigate("/login");
    }
  };

  return (
    <StyledWrapper>
      <div className="button-container">
        <button className="button" onClick={handleHomeClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024" strokeWidth={0} fill="currentColor" stroke="currentColor" className="icon">
            <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
          </svg>
        </button>
        <button className="button" onClick={handleProductsClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth={0} fill="currentColor" stroke="currentColor" className="icon">
            <path d="M3 1.5A1.5 1.5 0 0 1 4.5 0h15A1.5 1.5 0 0 1 21 1.5v21A1.5 1.5 0 0 1 19.5 24h-15A1.5 1.5 0 0 1 3 22.5v-21zM4.5 1.5v21h15v-21h-15zm3 4.5h9v1.5h-9V6zm0 3h9v1.5h-9V9zm0 3h9v1.5h-9V12zm0 3h9v1.5h-9V15z"/>
          </svg>
        </button>
        <button className="button" onClick={handleAddClick}>
          <i className = 'bi bi-plus-square'></i>
        </button>
        <button className="button" onClick={handleUserClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth={0} fill="currentColor" stroke="currentColor" className="icon">
            <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
          </svg>
        </button>
        <button className="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" className="icon">
            <circle r={1} cy={21} cx={9} />
            <circle r={1} cy={21} cx={20} />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>
      {isVerificationNotice ? (
        <Notification 
          isVisible={showNotification}
          message={notificationMessage}
          buttonText="Okay"
          onClose={() => setShowNotification(false)}
        />
      ) : (
        <Notification 
          isVisible={showNotification}
          message={notificationMessage}
          buttonText="Go to Login"
          onButtonClick={handleNotificationAction}
          onClose={() => setShowNotification(false)}
          showCancelButton={true}
        />
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;  
  align-items: center;      
  padding: 5px 0;

  .button-container {
    display: flex;
    background-color:#00274d;
    width: 50%;
    height: 60px;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px,
          rgba(245, 73, 144, 0.5) 5px 10px 15px;
    margin: 10px;
    padding: 15px;
  }

  .button {
    outline: 0 !important;
    border: 0 !important;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: all ease-in-out 0.3s;
    cursor: pointer;
  }

  .button:hover {
    transform: translateY(-3px);
  }

  .button .bi-plus-square{
    font-size: 24px;
  }

  .icon {
    font-size: 24px;
  }`;

export default Navbar;
