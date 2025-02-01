import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct, updatePhoto, deleteProduct } from '../api/ProductService';
import { auth } from '../api/Firebase-config.js';
import Notification from './Notification';
import './AddProduct.css';

const ProductEdit = ({ getAllMyProducts }) => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteNotification, setShowDeleteNotification] = useState(false);

    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        isAvailable: true,
        seller: '',
        sellerEmail: '',
        releaseDate: '',
        photoUrl: ''
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProduct(productId);
                setValues(response.data);
                setImagePreview(response.data.photoUrl);
                setLoading(false);
            } catch (e) {
                console.log(e);
                navigate('/products');
            }
        };
        fetchProduct();
    }, [productId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    const handleDelete = async () => {
        setShowDeleteNotification(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteProduct(productId);
            await getAllMyProducts(0);
            navigate('/user', { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                await user.reload();
            }
            if (user && user.emailVerified) {
                const formattedPrice = parseFloat(values.price).toFixed(2);
                setValues(prevValues => ({
                    ...prevValues,
                    price: formattedPrice
                }));

                await updateProduct(values);
                
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file, file.name);
                    formData.append('prodId', productId);
                    await updatePhoto(formData);
                }

                navigate(`/products/${productId}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="add-product-page">
                <div className="page-wrapper">
                    <div className="add-product-container">
                        <div className="add-product-header">
                            <h2>Edit Product</h2>
                            <p>Update your product listing</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="product-details">
                                <div className="input-box">
                                    <div className="details">
                                        <i className="bi bi-tag"></i>
                                        Product Name
                                    </div>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        required 
                                        value={values.name} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                
                                <div className="input-box">
                                    <div className="details">
                                        <i className="bi bi-currency-dollar"></i>
                                        Price
                                    </div>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        required 
                                        step="0.50"
                                        min="0"
                                        value={values.price} 
                                        onChange={handleInputChange} 
                                    />
                                </div>

                                <div className="input-box">
                                    <div className="details">
                                        <i className="bi bi-card-text"></i>
                                        Description
                                    </div>
                                    <textarea 
                                        name="description" 
                                        required 
                                        value={values.description} 
                                        onChange={handleInputChange} 
                                    />
                                </div>

                                <div className="input-box">
                                    <div className="details">
                                        <i className="bi bi-grid"></i>
                                        Category
                                    </div>
                                    <div className="radio-group">
                                        {['Electronics', 'Books', 'Clothing', 'Furniture', 'Other'].map((category) => (
                                            <div key={category} className="radio-option">
                                                <input
                                                    type="radio"
                                                    id={category}
                                                    name="category"
                                                    value={category}
                                                    checked={values.category === category}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <label htmlFor={category}>{category}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="input-box">
                                    <div className="details">
                                        <i className="bi bi-stars"></i>
                                        Condition
                                    </div>
                                    <div className="radio-group">
                                        {['New', 'Good', 'Fair', 'Poor'].map((condition) => (
                                            <div key={condition} className="radio-option">
                                                <input
                                                    type="radio"
                                                    id={condition}
                                                    name="condition"
                                                    value={condition}
                                                    checked={values.condition === condition}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <label htmlFor={condition}>{condition}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="input-box">
                                    <div className="details">
                                        <i className="bi bi-image"></i>
                                        Product Image
                                    </div>
                                    <div className="file-input-container">
                                        <div className="file-input-box">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                id="file-input"
                                                accept="image/*"
                                            />
                                            <label htmlFor="file-input" className="file-input-label">
                                                <i className="bi bi-cloud-upload"></i>
                                                <span>Click to update image</span>
                                                <span className="text-sm text-gray-500">PNG, JPG up to 10MB</span>
                                            </label>
                                        </div>
                                        {imagePreview && (
                                            <div className="image-preview">
                                                <img src={imagePreview} alt="Preview" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-buttons">
                                    <button type="button" className="btn btn-danger" onClick={handleDelete}>
                                        Delete Product
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate(`/products/${productId}`)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Update Product
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Notification 
                isVisible={showDeleteNotification}
                message="Are you sure you want to delete this product?"
                buttonText="Delete"
                onButtonClick={confirmDelete}
                onClose={() => setShowDeleteNotification(false)}
                showCancelButton={true}
            />
        </>
    );
};

export default ProductEdit; 