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
        localStorage.setItem('isAuthenticated', true);
      } else {
        setAuthentication(false);
        localStorage.setItem('isAuthenticated', false);
      }
    });

    return () => unsubscribe();
  }, [setAuthentication]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user");
    }
  }, [isAuthenticated, navigate])


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
        <div className="card-switch">
          <label className="switch">
            <input type="checkbox" className="toggle" />
            <span className="slider" />
            <span className="card-side" />
            <div className="flip-card__inner">
              <div className="flip-card__front">
                <div className="title">Log in</div>
                <form className="flip-card__form">
                  <input className="flip-card__input" name="email" placeholder="Email" type="email" onChange={handleInputChange} value={enteredEmail} />
                  <input className="flip-card__input" name="password" placeholder="Password" type="password" onChange={handleInputChange} value={password} />
                  <button className="flip-card__btn" onClick={handleLogin}>Let`s go!</button>
                </form>
              </div>
              <div className="flip-card__back">
                <div className="title">Sign up</div>
                <form className="flip-card__form">
                  <input className="flip-card__input" name="username" placeholder="Username" type="name" onChange={handleInputChange} value={enteredUsername} />
                  <input className="flip-card__input" name="email" placeholder="Email" type="email" onChange={handleInputChange} value={enteredEmail} />
                  <input className="flip-card__input" name="password" placeholder="Password" type="password" onChange={handleInputChange} value={password} />
                  <button className="flip-card__btn" onClick={handleSignUp}>Confirm!</button>
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .wrapper {
    --input-focus: #00274C;
    --font-color: #00274C;
    --font-color-sub: #666;
    --bg-color: #fff;
    --bg-color-alt: #666;
    --main-color: #00274C;
    display: flex; 
    align-items: center;
    justify-content: center;
    height: 85vh;
    width: 100%;
    background: linear-gradient(145deg, #FFCB05, #fff);
  }
  /* switch card */
  .switch {
    transform: translateY(-200px);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 50px;
    height: 20px;
  }

  .card-side::before {
    position: absolute;
    content: 'Log in';
    left: -70px;
    top: 0;
    width: 100px;
    text-decoration: underline;
    color: #00274C;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .card-side::after {
    position: absolute;
    content: 'Sign up';
    left: 70px;
    top: 0;
    width: 100px;
    text-decoration: none;
    color: #00274C;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .toggle {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-colorcolor);
    transition: 0.3s;
  }

  .slider:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    left: -2px;
    bottom: 2px;
    background-color: var(--bg-color);
    box-shadow: 0 3px 0 var(--main-color);
    transition: 0.3s;
  }

  .toggle:checked + .slider {
    background-color: #FFCB05;
  }

  .toggle:checked + .slider:before {
    transform: translateX(30px);
  }

  .toggle:checked ~ .card-side:before {
    text-decoration: none;
  }

  .toggle:checked ~ .card-side:after {
    text-decoration: underline;
  }

  /* card */ 

  .flip-card__inner {
    width: 300px;
    height: 350px;
    position: relative;
    background-color: transparent;
    perspective: 1000px;
      /* width: 100%;
      height: 100%; */
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .toggle:checked ~ .flip-card__inner {
    transform: rotateY(180deg);
  }

  .toggle:checked ~ .flip-card__front {
    box-shadow: none;
  }

  .flip-card__front, .flip-card__back {
    padding: 30px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: rgba(255, 255, 255, 0.95);
    gap: 20px;
    border-radius: 15px;
    border: 2px solid #00274C;
    box-shadow: 0 10px 20px rgba(0, 39, 76, 0.15);
    transition: all 0.3s ease;
  }

  .flip-card__back {
    width: 100%;
    transform: rotateY(180deg);
  }

  .flip-card__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .title {
    margin: 20px 0 20px 0;
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    color: #00274C;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .flip-card__input {
    width: 250px;
    height: 45px;
    border-radius: 10px;
    border: 2px solid #e0e0e0;
    background-color: var(--bg-color);
    box-shadow: 0 4px 8px rgba(0, 39, 76, 0.05);
    font-size: 16px;
    font-weight: 500;
    color: #00274C;
    padding: 5px 15px;
    outline: none;
    transition: all 0.3s ease;
  }

  .flip-card__input::placeholder {
    color: rgba(0, 39, 76, 0.6);
  }

  .flip-card__input:focus {
    border: 2px solid #00274C;
    box-shadow: 0 4px 8px rgba(0, 39, 76, 0.2);
  }

  .flip-card__btn {
    margin: 20px 0 20px 0;
    width: 140px;
    height: 45px;
    border-radius: 25px;
    border: none;
    background-color: #00274C;
    color: #FFCB05;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 39, 76, 0.3);
  }

  .flip-card__btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 39, 76, 0.4);
    background-color: #001324;
  }

  .flip-card__btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 39, 76, 0.4);
  }

  .flip-card__inner {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

export default Login;
