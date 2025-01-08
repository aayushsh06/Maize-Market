import React from 'react';
import "./Home.css";
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    const handleExploreClick = () => {
        navigate('/products');
    }
    return (
        <div className="homeContainer">
            <h1 className='header'>Welcome to Maize Market</h1>
            <button className='btn enter' onClick={handleExploreClick}>Explore</button>
        </div>
    )
}

export default Home
