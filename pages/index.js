import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';

export default function Home() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div>
      <Navbar onProductAdded={fetchProducts} />
      <main className="container mx-auto p-4">
        <ProductList products={products} onProductsChange={fetchProducts} />
      </main>
    </div>
  );
} 