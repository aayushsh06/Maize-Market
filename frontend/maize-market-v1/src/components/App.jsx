import { useEffect, useState } from 'react';
import { getProducts } from '../api/ProductService.js';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import Header from "./Header.jsx";
import ProductList from "./ProductList.jsx";
import Navbar from './NavBar.jsx';
import Home from './Home.jsx';
import SignIn from './Login.jsx';
import UserInfo from './UserInfo.jsx';
import ProductPage from './ProductPage.jsx';
import AddProduct from './AddProduct.jsx';

function App() {
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

  return (
    <>
      <Navbar numOfProducts={data.totalElements}></Navbar>
      <main className='main'>
        <div className='container'>
            <Routes>
              <Route path="/" element={<Navigate to={"/home"} />} />
              <Route path="/home" element={<Home/>}/>
              <Route path="/products" element={<ProductList data={data} currentPage={currentPage} getAllProducts={getAllProducts} />} />
              <Route path="/products/add" element={<AddProduct getAllProducts={getAllProducts} />} />
              <Route path="/login" element={<SignIn/>} />
              <Route path="/user" element={<UserInfo/>} />
              <Route path="/products/:productId" element={<ProductPage/>}/>
            </Routes>
        </div>
      </main>
    </>
  )
}

export default App;
