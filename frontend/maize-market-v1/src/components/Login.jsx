import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserContext } from './UserContext.jsx';
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence, signOut, db, ref, update, get } from '../api/Firebase-config.js';
import Loader from "./Loader.jsx";
import { useNavigate } from 'react-router-dom';

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
      const userCredential = await createUserWithEmailAndPassword(auth, enteredEmail, password);
      const user = userCredential.user;

      setUsername(enteredUsername);
      localStorage.setItem('username', enteredUsername);
      setEmail(enteredEmail);
      localStorage.setItem('email', enteredEmail);

      await createUserProfile(user);

      await sendEmailVerification(user);

      setEnteredEmail('');
      setEnteredUsername('');
      setPassword('');
      setAuthentication(true);

      alert("Verification email sent! Please check your inbox.")
    }
    catch (error) {
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
      }
      else {
        console.log("No user data found!");
        alert("An unexpected error occured!")
      }

    }
    catch (error) {
      alert("Incorrect email or password");
      setError(error.message);
    }

  }


  if (loading) {
    return <Loader></Loader>
  }


  return (
    <StyledWrapper>
      <div className="wrapper">
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
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .wrapper {
    --primary-color: #00274C;
    --secondary-color: #FFCB05;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 85vh;
    width: 100%;
    padding: 20px;
  }

  .auth-container {
    width: 100%;
    max-width: 400px;
    min-height: 450px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 39, 76, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .tab-switcher {
    display: flex;
    width: 100%;
    border-bottom: 1px solid rgba(0, 39, 76, 0.1);
    flex-shrink: 0;
  }

  .tab-btn {
    flex: 1;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .tab-btn.active {
    color: var(--primary-color);
  }

  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--primary-color);
    border-radius: 3px 3px 0 0;
  }

  .form-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 30px;
  }

  .form-section {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .title {
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: 600;
    color: var(--primary-color);
    text-align: center;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .auth-input {
    width: 100%;
    height: 50px;
    border-radius: 12px;
    border: 1px solid rgba(0, 39, 76, 0.2);
    background-color: rgba(255, 255, 255, 0.9);
    padding: 0 20px;
    font-size: 15px;
    font-weight: 500;
    color: var(--primary-color);
    transition: all 0.3s ease;
  }

  .auth-input::placeholder {
    color: rgba(0, 39, 76, 0.5);
  }

  .auth-input:focus {
    border: 2px solid var(--primary-color);
    box-shadow: 0 0 0 4px rgba(0, 39, 76, 0.1);
    outline: none;
  }

  .auth-btn {
    width: 100%;
    height: 50px;
    border-radius: 12px;
    border: none;
    background-color: var(--primary-color);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
  }

  .auth-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 39, 76, 0.2);
    background-color: #001f3d;
  }

  .auth-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 39, 76, 0.15);
  }

  @media (max-width: 480px) {
    .auth-container {
      max-width: 320px;
      min-height: 430px;
    }
    
    .form-container {
      padding: 30px 20px;
    }
  }
`;

export default Login;
