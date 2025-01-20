import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, signOut } from '../api/Firebase-config.js';
import { UserContext } from './UserContext.jsx';
import { getMyProducts } from '../api/ProductService.js';
import MyProductList from './MyProductList.jsx';
import './UserInfo.css';

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
    }, []);

    return (
        <>
            <div className="welcome-container">
                <h1>User Info:</h1>
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Email:</strong> {email}</p>
                <button className='signOutButton' onClick={handleSignOut}>Sign Out</button>
            </div>
            <h1 className="productsHeader">Your Products:</h1>
            <MyProductList data={data} currentPage={currentPage} sellerEmail={email} getMyProducts={getAllMyProducts} />
        </>
    )
}

export default UserInfo
