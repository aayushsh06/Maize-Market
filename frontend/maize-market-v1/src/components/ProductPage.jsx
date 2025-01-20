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
        <div className="page-container">
            <div className="productPage-container">
                <div className="product-image-section">
                    <div className="image-wrapper">
                        <img src={product.photoUrl} alt={product.name}/>
                    </div>
                </div>
                
                <div className="product-details">
                    <div className="product-header">
                        <h1 className="product-name">{product.name}</h1>
                        <p className="product-price">${product.price}</p>
                    </div>

                    <div className="product-availability-badge" 
                         data-available={product.available}>
                        {product.available ? 'In Stock' : 'Out of Stock'}
                    </div>

                    <div className="product-main-info">
                        <div className="info-group">
                            <h2>Description</h2>
                            <p>{product.description}</p>
                        </div>

                        <div className="product-specs">
                            <div className="spec-item">
                                <span className="spec-label">Condition</span>
                                <span className="spec-value">{product.condition}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Category</span>
                                <span className="spec-value">{product.category}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Listed On</span>
                                <span className="spec-value">{product.releaseDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="seller-section">
                        <h2>Seller Information</h2>
                        <div className="seller-info">
                            <p className="seller-name">{product.seller}</p>
                            <a href={`mailto:${product.sellerEmail}`} className="seller-email">
                                {product.sellerEmail}
                            </a>
                        </div>
                    </div>

                    <div className="product-id">Product ID: {product.id}</div>
                </div>
            </div>
        </div>
    )
}

export default ProductPage
