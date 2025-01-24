import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext.jsx';
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence, signOut, db, ref, update, get } from '../api/Firebase-config.js';
import Loader from "./Loader.jsx";
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import './Login.css';

const Login = () => {
  const { username, setUsername, setAuthentication, isAuthenticated, email, setEmail } = useContext(UserContext);
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 
  const [data, setData] = useState({ content: [], totalElements: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showError, setShowError] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');

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
      if (user && user.emailVerified) {
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
      const userRef = ref(db, "users/" + user.uid);
      await update(userRef, {
        username: enteredUsername,
        email: enteredEmail,
        createdAt: new Date().toISOString()
      });
      console.log("User Profile Created")
    }
    catch (error) {
      console.error("Error updating user profile:", error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEnteredEmail(value);
    }
    else if (name === 'username') {
      setEnteredUsername(value);
    }
    else {
      setPassword(value);
    }

  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {

      if(!enteredEmail.includes("@umich.edu") || enteredEmail.includes(" ")) {
        throw new Error("Please use a valid University of Michigan email address");
      }
      if(password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, enteredEmail, password);
      const user = userCredential.user;


      await createUserProfile(user);
      await sendEmailVerification(user);

      setUsername(enteredUsername);
      localStorage.setItem('username', enteredUsername);
      setEmail(enteredEmail);
      localStorage.setItem('email', enteredEmail);



      setEnteredEmail('');
      setEnteredUsername('');
      setPassword('');
      setAuthentication(true);
      localStorage.setItem('isAuthenticated', true);

      alert("Verification email sent! Please check your inbox.");
    }
    catch (error) {
      if(error.message.includes("auth/email-already-in-use")) {
        error.message = "Email already in use";
      }
      else if(error.message.includes("auth/invalid-email")) {
        error.message = "Please use a valid University of Michigan email address";
      }
      else if(error.message.includes("auth/weak-password")) {
        error.message = "Password must be at least 8 characters long";
      }
      else {
        error.message = "An unexpected error occured";
      }
      setShowError(true);
      setNotificationMessage(error.message);
      setNotificationType('error');
      setError(error.message);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, enteredEmail, password);
      const user = userCredential.user;

      const userRef = ref(db, 'users/' + user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const fetchedUsername = userData.username;
        const fetchedEmail = userData.email;

        setUsername(fetchedUsername);
        localStorage.setItem('username', fetchedUsername);
        setEmail(fetchedEmail);
        localStorage.setItem('email', fetchedEmail);

        setEnteredEmail('');
        setPassword('');
        setAuthentication(true);
        localStorage.setItem('isAuthenticated', true);
      }
      else {
        throw new Error();
      }

    }
    catch (error) {
      setShowError(true);
      setNotificationMessage("Incorrect email or password");
      setNotificationType('error');
      setError("Incorrect email or password");
    }

  }


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
          <div className="tab-switcher">
            <button 
              className={`tab-btn ${!isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(false)}
            >
              Login
            </button>
            <button 
              className={`tab-btn ${isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>
          
          <div className={`form-container ${isSignUp ? 'show-signup' : ''}`}>
            {!isSignUp ? (
              <div className="form-section">
                <div className="title">Welcome Back</div>
                <form className="auth-form">
                  <input className="auth-input" name="email" placeholder="Email" type="email" onChange={handleInputChange} value={enteredEmail} />
                  <input className="auth-input" name="password" placeholder="Password" type="password" onChange={handleInputChange} value={password} />
                  <button className="auth-btn" onClick={handleLogin}>Login</button>
                </form>
              </div>
            ) : (
              <div className="form-section">
                <div className="title">Create Account</div>
                <form className="auth-form">
                  <input className="auth-input" name="username" placeholder="Username" type="name" onChange={handleInputChange} value={enteredUsername} />
                  <input className="auth-input" name="email" placeholder="Email" type="email" onChange={handleInputChange} value={enteredEmail} />
                  <input className="auth-input" name="password" placeholder="Password" type="password" onChange={handleInputChange} value={password} />
                  <button className="auth-btn" onClick={handleSignUp}>Sign Up</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
