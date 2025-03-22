import React from 'react'
import {Link} from 'react-router-dom'
import './Product.css';

const Product = ({product}) => {
  return (
    <Link to={`/products/${product.id}`} className="product_item">
      <div className="product_image">
        <img src={product.photoUrl} alt={product.name}/>
      </div>
      <div className="product_content">
        <h3 className="product_name">{product.name}</h3>
        <p className="product_description">{product.description}</p>
        <div className="product_footer">
          <span className="product_price">${product.price}</span>
          <span className="product_seller">By {product.seller.substring(0, 25)}</span>
        </div>
      </div>
    </Link>
  )
}

export default Product
