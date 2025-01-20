import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, signOut } from '../api/Firebase-config.js';
import { UserContext } from './UserContext.jsx';
import { getMyProducts } from '../api/ProductService.js';
import MyProductList from './MyProductList.jsx';
import './UserInfo.css';
import { FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';

const UserInfo = () => {
    const { username, setUsername, isAuthenticated, setAuthentication, email, setEmail } = useContext(UserContext);
    const [data, setData] = useState({content:[],totalElements:0});
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const handleSignOut = async (e) => {
        try {
            await signOut(auth);
            setUsername('');
            localStorage.removeItem('username')
            setEmail('');
            localStorage.removeItem('email');
            setAuthentication(false);
            localStorage.setItem('isAuthenticated', false);
            navigate("/login")
        }
        catch (error) {
            setError(error.message);
        }

    }

    const getAllMyProducts = async (page = 0, size = 10) => {
        try {
            const { data } = await getMyProducts(page, size, email);
            setData(data);

        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllMyProducts(currentPage);
    }, [email]);

    return (
        <div className="user-info-page">
            <div className="welcome-container">
                <div className="user-header">
                    <FaUser className="user-icon" />
                    <h1>User Profile</h1>
                </div>
                <div className="user-details">
                    <div className="info-row">
                        <FaUser className="info-icon" />
                        <p><strong>Username:</strong> {username}</p>
                    </div>
                    <div className="info-row">
                        <FaEnvelope className="info-icon" />
                        <p><strong>Email:</strong> {email}</p>
                    </div>
                </div>
                <button className='signOutButton' onClick={handleSignOut}>
                    <FaSignOutAlt className="signout-icon" />
                    Sign Out
                </button>
            </div>
            <div className="products-section">
                <h1 className="productsHeader">Your Products</h1>
                <MyProductList data={data} currentPage={currentPage} sellerEmail={email} getMyProducts={getAllMyProducts} />
            </div>
        </div>
    )
}

export default UserInfo
