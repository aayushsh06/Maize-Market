import { useEffect, useState } from 'react';
import { getProducts } from './api/ProductService.js';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from "./components/Header.jsx";
import ProductList from "./components/ProductList.jsx";
import AddProductModal from './components/AddProductModal.jsx';
import Navbar from './components/Navbar.jsx';

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

  return (
    <>
      <Header toggleModal={toggleModal} numOfProducts={data.totalElements} />
      <Navbar></Navbar>
      <main className='main'>
        <div className='container'>
          <Routes>
            <Route path="/" element={<Navigate to={"/products"} />} />
            <Route path="/products" element={<ProductList data={data} currentPage={currentPage} getAllProducts={getAllProducts} />} />
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
