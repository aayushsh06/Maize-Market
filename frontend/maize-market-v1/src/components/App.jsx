import { useEffect, useState } from 'react';
import { getProducts } from '../api/ProductService.js';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from "./Header.jsx";
import ProductList from "./ProductList.jsx";
import AddProductModal from './AddProductModal.jsx';
import Navbar from './Navbar.jsx';
import Home from './Home.jsx';
import SignIn from './Login.jsx';

function App() {
  const formatDate = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear(); 
    return `${month}-${day}-${year}`;
    };

  const [data, setData] = useState({content:[],totalElements:0});
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file,setFile] = useState(undefined);
  const [values,setValues] = useState({
    name: '', 
    description: '', 
    price: '', 
    category: '',
    condition: '',
    isAvailable: true,
    seller: 'EpicSeller123',
    releaseDate: formatDate(new Date())
  });
  const location = useLocation();

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

  const toggleModal = (show) => {
    setIsModalOpen(show);
  }

  const shouldShowHeader = location.pathname === '/products';

  return (
    <>
      
      <Navbar toggleModal={toggleModal} numOfProducts={data.totalElements}></Navbar>
      <main className='main'>
        <div className='container'>
          <Routes>
            <Route path="/" element={<Navigate to={"/home"} />} />
            <Route path="/home" element={<Home/>}/>
            <Route path="/products" element={<ProductList data={data} currentPage={currentPage} getAllProducts={getAllProducts} />} />
            <Route path="/login" element={<SignIn/>} />
          </Routes>
        </div>
      </main>

      <AddProductModal 
        isModalOpen={isModalOpen} 
        toggleModal={toggleModal}
        file={file}
        setFile={setFile}
        values={values}
        setValues={setValues}
        getAllProducts={getAllProducts} 
        />

    </>
  )
}

export default App;
