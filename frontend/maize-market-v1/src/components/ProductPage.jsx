import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../api/ProductService';
import Loader from './Loader.jsx';
import { UserContext } from './UserContext';
import './ProductPage.css'

const ProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { email } = useContext(UserContext);
    
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
            <div className="productPage-container" data-available={true}>
                <div className="product-image-section">
                    <div className="image-wrapper" data-available={true}>
                        <img src={product.photoUrl} alt={product.name}/>
                    </div>
                </div>
                
                <div className="product-details">
                    <div className="product-header">
                        <h1 className="product-name">{product.name}</h1>
                        <div className="product-price">${product.price}</div>
                        <div 
                            className="product-availability-badge" 
                            data-available={true}
                        >
                            In Stock
                        </div>
                    </div>

                    <div className="product-main-info">
                        <div className="info-group">
                            <h2>Description</h2>
                            <p>{product.description}</p>
                        </div>

                        <div className="product-specs" data-available={true}>
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
                            {email === product.sellerEmail && (
                                <Link 
                                    to={`/products/edit/${product.id}`} 
                                    className="edit-product-button"
                                >
                                    Edit Listing
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="product-id">Product ID: {product.id}</div>
                </div>
            </div>
        </div>
    )
}

export default ProductPage
