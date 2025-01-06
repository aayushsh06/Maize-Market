import React from 'react'
import {Link} from 'react-router-dom'
import './Product.css';

const Product = ({product}) => {
  return (
    <Link to ={`/products/${product.id}`} className="product_item">
        <div className = "product_header">
            <div className="product_image">
                <img src={product.photoUrl} alt ={product.name}/>
            </div>
            <div className="product_details">
                <p className = "product_name">{product.name.substring(0,15)}</p>
                <p className = "product_price">${product.price}</p>
            </div>
        </div>
        <div className = "product_body">
            <p className = "product_description">{product.description.substring(0,150)}</p>
            <p className = "product_seller">{product.seller.substring(0,20)}</p>
        </div>
    </Link>
  )
}


export default Product
