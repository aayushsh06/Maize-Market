import React from 'react';
import Product from "./Product";
import './ProductList.css';

const ProductList = ({ data, currentPage, getAllProducts }) => {
  return (
    <div className="products-container">
      <header className="products-header">
        <h1>Maize Market</h1>
        <p className="products-subheading">Discover products from our community</p>
      </header>
      
      <main className='main'>
        {data?.content?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛍️</div>
            <h2>No Products Available</h2>
            <p>Looks like our marketplace is currently empty. Check back soon for exciting new listings!</p>
            <a href="#" className="browse-button">Explore Categories</a>
          </div>
        ) : (
          <>
            <ul className='product_list animate-fade-in'>
              {data?.content?.map(product => (
                <li key={product.id} className="animate-fade-up">
                  <Product product={product} />
                </li>
              ))}
            </ul>

            {data?.totalPages > 1 && (
              <div className='pagination'>
                <button 
                  onClick={() => getAllProducts(currentPage - 1)} 
                  className={`pagination-btn ${currentPage === 0 ? 'disabled' : ''}`}
                  disabled={currentPage === 0}
                  aria-label="Previous page"
                >
                  &laquo;
                </button>
                
                {[...Array(data.totalPages).keys()].map(page => (
                  <button
                    onClick={() => getAllProducts(page)}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    key={page}
                    aria-label={`Page ${page + 1}`}
                  >
                    {page + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => getAllProducts(currentPage + 1)}
                  className={`pagination-btn ${data.totalPages === currentPage + 1 ? 'disabled' : ''}`}
                  disabled={data.totalPages === currentPage + 1}
                  aria-label="Next page"
                >
                  &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProductList;