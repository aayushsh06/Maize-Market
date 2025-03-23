import React from 'react';
import "../styles/Home.css";
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserFriends, FaLock, FaHandshake } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();
    const handleExploreClick = () => {
        navigate('/products');
    }
    return (
        <div className="homeContainer">
            <div className="hero-section">
                <h1 className="header">Welcome to Maize Market</h1>
                <p className="subheader">Your University of Michigan Marketplace</p>
                <button className="btn enter" onClick={handleExploreClick}>
                    Start Shopping
                </button>
            </div>

            <div className="features-section">
                <div className="feature-card">
                    <FaUserFriends className="feature-icon" />
                    <h2>Student-to-Student</h2>
                    <p>Connect directly with fellow University of Michigan students to buy and sell items.</p>
                </div>

                {/*}<div className="feature-card">
                    <FaShoppingCart className="feature-icon" />
                    <h2>Easy Shopping</h2>
                    <p>Browse, save, and purchase items with our intuitive cart system.</p>
                </div>
                {*/}

                <div className="feature-card">
                    <FaLock className="feature-icon" />
                    <h2>Secure Platform</h2>
                    <p>Verified UMich email accounts required for all users.</p>
                </div>

                <div className="feature-card">
                    <FaHandshake className="feature-icon" />
                    <h2>Local Exchange</h2>
                    <p>Meet safely on campus for item exchanges.</p>
                </div>
            </div>

            <div className="about-section">
                <h2>About Maize Market</h2>
                <p>
                    Maize Market is the premier marketplace exclusively for University of Michigan students. 
                    Whether you're looking to sell textbooks, find dorm essentials, or discover unique items 
                    from fellow Wolverines, our platform makes it easy and secure.
                </p>
            </div>
        </div>
    )
}

export default Home
