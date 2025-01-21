import { useEffect, useState, useContext } from 'react';
import { getProducts } from '../api/ProductService.js';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from "./UserContext";

import Header from "./Header.jsx";
import ProductList from "./ProductList.jsx";
import Navbar from './NavBar.jsx';
import Home from './Home.jsx';
import SignIn from './Login.jsx';
import UserInfo from './UserInfo.jsx';
import ProductPage from './ProductPage.jsx';
import AddProduct from './AddProduct.jsx';
import ProductEdit from './ProductEdit.jsx';
import Cart from './Cart.jsx';

function App() {
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({content:[], totalElements:0});
  const [currentPage, setCurrentPage] = useState(0);

  const getAllProducts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getProducts(page, size);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllProducts();
  }, []);

  // Add authentication check
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Add public route check (for login page)
  const PublicRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/user" replace />;
    }
    return children;
  };

  return (
    <>
      <Navbar numOfProducts={data.totalElements}></Navbar>
      <main className='main'>
        <div className='container'>
            <Routes>
              <Route path="/" element={<Navigate to={"/home"} />} />
              <Route path="/home" element={<Home/>}/>
              <Route path="/products" element={<ProductList data={data} currentPage={currentPage} getAllProducts={getAllProducts} />} />
              <Route 
                path="/products/add" 
                element={
                  <ProtectedRoute>
                    <AddProduct getAllProducts={getAllProducts} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <SignIn/>
                  </PublicRoute>
                } 
              />
              <Route 
                path="/user" 
                element={
                  <ProtectedRoute>
                    <UserInfo/>
                  </ProtectedRoute>
                } 
              />
              <Route path="/products/:productId" element={<ProductPage/>}/>
              <Route 
                path="/products/edit/:productId" 
                element={
                  <ProtectedRoute>
                    <ProductEdit getAllMyProducts={getAllProducts} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
            </Routes>
        </div>
      </main>
    </>
  )
}

export default App;
