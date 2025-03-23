import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.jsx';
import { auth } from '../api/Firebase-config.js';
import Notification from './Notification.jsx';
import '../styles/Navbar.css';

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
  const handleCartClick = () => {
    const currentUser = auth.currentUser;
    
    if (!isAuthenticated) {
      setIsVerificationNotice(false);
      setNotificationMessage("You need to be logged in to view your cart. Please sign in or create an account.");
      setShowNotification(true);
    } else if (currentUser && !currentUser.emailVerified) {
      setIsVerificationNotice(true);
      setNotificationMessage("Please verify your email before accessing your cart. Check your inbox for the verification link.");
      setShowNotification(true);
    } else {
      navigate("/cart");
    }
  }

  const handleNotificationAction = () => {
    setShowNotification(false);
    if (!isAuthenticated) {
      navigate("/login");
    }
  };

  const handleMessagesClick = () => {
    const currentUser = auth.currentUser;
    
    if (!isAuthenticated) {
      setIsVerificationNotice(false);
      setNotificationMessage("You need to be logged in to Message. Please sign in or create an account.");
      setShowNotification(true);
    } else if (currentUser && !currentUser.emailVerified) {
      setIsVerificationNotice(true);
      setNotificationMessage("Please verify your email before accessing your cart. Check your inbox for the verification link.");
      setShowNotification(true);
    } else {
      navigate("/messages");
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo" onClick={handleHomeClick}>
          Maize Market
        </div>
        
        <div className="nav-links">
          <button className="nav-link" onClick={handleProductsClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth={0} fill="currentColor" stroke="currentColor" className="icon">
              <path d="M3 1.5A1.5 1.5 0 0 1 4.5 0h15A1.5 1.5 0 0 1 21 1.5v21A1.5 1.5 0 0 1 19.5 24h-15A1.5 1.5 0 0 1 3 22.5v-21zM4.5 1.5v21h15v-21h-15zm3 4.5h9v1.5h-9V6zm0 3h9v1.5h-9V9zm0 3h9v1.5h-9V12zm0 3h9v1.5h-9V15z"/>
            </svg>
            Products
          </button>
          
          <button className="nav-link" onClick={handleAddClick}>
            <i className='bi bi-plus-square'></i>
            Add Product
          </button>
          
          <button className="nav-link" onClick={handleCartClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" className="icon">
              <circle r={1} cy={21} cx={9} />
              <circle r={1} cy={21} cx={20} />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Cart
          </button>

          <button className="nav-link" onClick={handleMessagesClick}>
            <i className='bi bi-chat-dots'></i>
            Messages
          </button>
          
          <button className="nav-link" onClick={handleUserClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth={0} fill="currentColor" stroke="currentColor" className="icon">
              <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
            </svg>
            {isAuthenticated ? 'Profile' : 'Login'}
          </button>
        </div>
      </nav>

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
    </>
  );
}

export default Navbar;