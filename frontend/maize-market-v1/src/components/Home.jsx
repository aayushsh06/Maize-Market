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
            <div className="hero-section">
                <h1 className="header">Welcome to Maize Market</h1>
                <p className="subheader">Your one-stop destination for quality products</p>
                <button className="btn enter" onClick={handleExploreClick}>
                    Start Shopping
                </button>
            </div>
        </div>
    )
}

export default Home
