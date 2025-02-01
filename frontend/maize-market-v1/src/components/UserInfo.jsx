import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth, signOut } from '../api/Firebase-config.js';
import { UserContext } from './UserContext.jsx';
import { getMyProducts } from '../api/ProductService.js';
import MyProductList from './MyProductList.jsx';
import './UserInfo.css';
import { FaUser, FaEnvelope, FaSignOutAlt, FaBox } from 'react-icons/fa';

const UserInfo = () => {
    const { username, setUsername, isAuthenticated, setAuthentication, email, setEmail } = useContext(UserContext);
    const [data, setData] = useState({content:[],totalElements:0});
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSignOut = async (e) => {
        e.preventDefault(); 
        try {
            await signOut(auth);

            setUsername('');
            localStorage.removeItem('username');
            setEmail('');
            localStorage.removeItem('email');
            setAuthentication(false);
            localStorage.setItem('isAuthenticated', false);
            navigate("/login");
        } catch (error) {
            console.error("Error during sign out:", error);
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
                <h1 className="welcome-header">User Profile</h1>
                <div className="user-details">
                    <div className="user-detail-item">
                        <span className="user-detail-label">Username:</span>
                        <span className="user-detail-value">{username}</span>
                    </div>
                    <div className="user-detail-item">
                        <span className="user-detail-label">Email:</span>
                        <span className="user-detail-value">{email}</span>
                    </div>
                    <button className="logout-button" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="products-section">
                <h2 className="productsHeader">Your Products</h2>
                {data?.content?.length === 0 ? (
                    <div className="empty-state">
                        <FaBox className="empty-icon" />
                        <h2>You haven't listed any products yet</h2>
                        <p>Start selling by adding your first product!</p>
                        <Link to="/products/add" className="add-product-button">
                            Add Your First Product
                        </Link>
                    </div>
                ) : (
                    <MyProductList 
                        data={data} 
                        currentPage={currentPage} 
                        sellerEmail={email} 
                        getMyProducts={getAllMyProducts} 
                    />
                )}
            </div>
        </div>
    )
}

export default UserInfo
