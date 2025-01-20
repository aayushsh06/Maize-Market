import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../api/ProductService';
import Loader from './Loader.jsx';
import './ProductPage.css'

const ProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProduct(productId);
                setProduct(response.data);
                setLoading(false);
            }
            catch (e) {
                console.log(e);
            }
        }
        fetchProduct();

    }, [productId])

    if (loading) {
        return <Loader></Loader>
    }
    return (
        <div className="productPage-container">
            <div className="product-image">
            <img src={product.photoUrl} alt={product.name}/>
            </div>
            <div className="product-details">
            <h1 className="product-name">{product.name}</h1>
            <p className="product-category"><strong>Category:</strong> {product.category}</p>
            <p className="product-condition"><strong>Condition:</strong> {product.condition}</p>
            <p className="product-description"><strong>Description:</strong> {product.description}</p>
            <p className="product-price"><strong>Price:</strong> ${product.price}</p>
            <p className="product-release-date"><strong>List Date:</strong> {product.releaseDate}</p>
            <p className="product-seller"><strong>Seller:</strong> {product.seller}</p>
            <p className="product-seller-email"><strong>Seller Email:</strong> <a href={product.sellerEmail}>{product.sellerEmail}</a></p>
            <p className="product-availability"><strong>Availability:</strong> <span className="available">{product.available ? 'In Stock' : 'Out of Stock'}</span></p>
            <p className="product-id"><strong>Product ID:</strong> {product.id}</p>
            </div>
        </div>
    )
}

export default ProductPage
