import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, updatePhoto } from '../api/ProductService';
import { auth } from '../api/Firebase-config.js';
import './AddProduct.css';
import styled from 'styled-components';

const AddProduct = ({ getAllProducts }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const formatDate = (date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        isAvailable: true,
        seller: localStorage.getItem('username'),
        sellerEmail: localStorage.getItem('email'),
        releaseDate: formatDate(new Date())
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                await user.reload();
            }
            if (localStorage.getItem('isAuthenticated') === 'true' && user && user.emailVerified) {
                const formattedPrice = parseFloat(values.price).toFixed(2);
                setValues(prevValues => ({
                    ...prevValues,
                    price: formattedPrice
                }));

                const { data } = await addProduct(values);
                const formData = new FormData();
                formData.append('file', file, file.name);
                formData.append('prodId', data.id);
                await updatePhoto(formData);
                
                await getAllProducts();
                navigate('/products');
            } else {
                if (localStorage.getItem('isAuthenticated') === 'true') {
                    alert("Email not verified yet. Please check your inbox.");
                } else {
                    //navigate('/login');
                    console.log(localStorage.getItem('isAuthenticated'));
                    alert("Must Login to List a Product");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="add-product-page">
            <div className="page-wrapper">
                <div className="add-product-container">
                    <div className="add-product-header">
                        <h2>List New Product</h2>
                        <p>Share your item with the Michigan community</p>
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
                                    placeholder="Enter product name" 
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
                                    placeholder="Enter price" 
                                    step="1.00"
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
                                    placeholder="Describe your product..." 
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
                                            required
                                            id="file-input"
                                            accept="image/*"
                                        />
                                        <label htmlFor="file-input" className="file-input-label">
                                            <i className="bi bi-cloud-upload"></i>
                                            <span>Click to upload an image</span>
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
                                <button type="button" className="btn btn-danger" onClick={() => navigate('/products')}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    List Product
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const StyledWrapperCategory = styled.div`
    // Same styled components from AddProductModal
`;

const StyledWrapperCondition = styled.div`
    // Same styled components from AddProductModal
`;

export default AddProduct; 