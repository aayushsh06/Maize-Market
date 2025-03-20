import React from 'react'
import Product from "./Product"
import './ProductList.css'

const ProductList = ({data, currentPage, getAllProducts}) => {
  return (
    <div className="products-container">
      <header className="products-header">
        <h1>For Sale</h1>
      </header>
      
      <main className='main'>
        {data?.content?.length === 0 && (
          <div className="no-products">
            <h2>No Products Available</h2>
            <p>Check back later for new listings</p>
          </div>
        )}

        <ul className='product_list'>
          {data?.content?.length > 0 && 
            data.content.map(product => 
              <Product product={product} key={product.id}/>
            )}
        </ul>

        {data?.content?.length > 0 && data?.totalPages > 1 && (
          <div className='pagination'>
            <button 
              onClick={() => getAllProducts(currentPage - 1)} 
              className={`pagination-btn ${currentPage === 0 ? 'disabled' : ''}`}
              disabled={currentPage === 0}
            >
              &laquo;
            </button>
            
            {data && [...Array(data.totalPages).keys()].map(page => (
              <button
                onClick={() => getAllProducts(page)}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                key={page}
              >
                {page + 1}
              </button>
            ))}
            
            <button 
              onClick={() => getAllProducts(currentPage + 1)}
              className={`pagination-btn ${data.totalPages === currentPage + 1 ? 'disabled' : ''}`}
              disabled={data.totalPages === currentPage + 1}
            >
              &raquo;
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProductList;
