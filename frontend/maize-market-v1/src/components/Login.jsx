import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext.jsx';
import { auth, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence, signOut, db, ref, update, get, provider } from '../api/Firebase-config.js';
import Loader from "./Loader.jsx";
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import '../styles/Login.css';

const Login = () => {
  const { username, setUsername, setAuthentication, isAuthenticated, email, setEmail } = useContext(UserContext);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }

    setPersistence(auth, browserLocalPersistence)
      .catch((error) => console.log(error.message));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setAuthentication(true);
      } else {
        setAuthentication(false);
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('isAuthenticated');
      }
    });

    return () => unsubscribe();
  }, [setAuthentication]);

  const createUserProfile = async (user) => {
    try {
      const extractedUsername = user.email.split('@')[0];
      
      const userRef = ref(db, "users/" + user.uid);
      await update(userRef, {
        username: extractedUsername,
        email: user.email,
        createdAt: new Date().toISOString()
      });
      
      return extractedUsername;
    }
    catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  const handleProviderSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = ref(db, 'users/' + user.uid);
      const snapshot = await get(userRef);
      
      let userUsername;
      if (snapshot.exists()) {
        const userData = snapshot.val();
        userUsername = userData.username;
      } else {
        userUsername = await createUserProfile(user);
      }

      setUsername(userUsername);
      localStorage.setItem('username', userUsername);
      setEmail(user.email);
      localStorage.setItem('email', user.email);
      setAuthentication(true);
      localStorage.setItem('isAuthenticated', true);
      
      navigate('/');
    } catch (error) {
      let errorMessage = "An error occurred during sign in";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Sign-in was cancelled";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Pop-up was blocked by the browser. Please allow pop-ups for this site.";
      }
      
      setShowError(true);
      setNotificationMessage(errorMessage);
      setNotificationType('error');
      setError(errorMessage);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {showError && <Notification 
        message={notificationMessage} 
        isVisible={showError}
        onClose={() => setShowError(false)}
        buttonText="OK"
        showCancelButton={false}
        onButtonClick={() => setShowError(false)}
      />}
      <div className="login-wrapper">
        <div className="auth-container">
          <div className="title">Welcome to Maize Market</div>
          <div className="login-message">
            <p>Sign in to continue to your account</p>
          </div>
          <div className="provider-container">
            <button className="provider-btn" onClick={handleProviderSignIn}>
              Sign in with Google
            </button>
          </div>
          <div className="login-footer">
            <p>All email domains are accepted until December 2025</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;