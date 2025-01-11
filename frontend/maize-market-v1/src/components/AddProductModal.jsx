import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import './AddProductModal.css';
import { addProduct, updatePhoto } from '../api/ProductService';
import { useNavigate } from 'react-router-dom';
import {auth} from '../api/Firebase-config.js';
import axios from 'axios';

const AddProductModal = ({ isModalOpen, setIsModalOpen, toggleModal, file, setFile, values, setValues, getAllProducts }) => {
    const formatDate = (date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear(); 
        return `${month}-${day}-${year}`;
        };

    const fileInputRef = useRef(null);
    const modalRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        const handleModal = async () => {
            if (isModalOpen) {
                try{
                    const user = auth.currentUser;
                    if(user){
                        await user.reload();
                    }
                    if(localStorage.getItem('isAuthenticated')==='true' && user && user.emailVerified){
                        modalRef.current.showModal();
                    }
                    else{
                        if(localStorage.getItem('isAuthenticated')==='true'){
                            alert("Email not verified yet. Please check your inbox.");  
                        }
                        else{
                            navigate('/login');
                            alert("Must Login to List a Product");
                        }
                        setIsModalOpen(false);
                    }
                }
                catch(error){
                    console.error("Error Checking User Status",error);
                }
            }
            else {
                setValues((prevValues) =>({
                    ...prevValues,
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    condition: '',
                }));
                setFile(null);
                setImagePreview(null);
                modalRef.current.close();
            }
        };

        handleModal();
    },[isModalOpen]);

    const [imagePreview, setImagePreview] = useState(null);
    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues(prevValues => ({
            ...prevValues, [name]: value
        }))
    }
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    }

    const handleFileClick = (e) => {
        fileInputRef.current.value = null;
        setFile(null);
        setImagePreview(null);
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const formattedPrice = parseFloat(values.price).toFixed(2);
        setValues(prevValues => ({
            ...prevValues,
            price: formattedPrice
        }));
        try {
            const {data} = await addProduct(values);
            const formData = new FormData();
            formData.append('file',file,file.name);
            formData.append('prodId', data.id);
            const{data : photoUrl} = await updatePhoto(formData);
            toggleModal(false);
            fileInputRef.current.value = null;
            setFile(null);
            setImagePreview(null);
            getAllProducts();
        }
        catch {
            console.log(e);
        }
    }

    return (
        <dialog ref={modalRef} className="modal" id="modal">
            <div className="modal_header">
                <h3>List New Product</h3>
                <i onClick={() => toggleModal(false)} className="bi bi-x-lg" style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#333' }}></i>
            </div>
            <div className="divider"></div>
            <div className="modal_body">
                <form onSubmit={handleSave}>
                    <div className="product-details">
                        <div className="input-box">
                            <div className="details">Product Name</div>
                            <input type="text" name="name" required placeholder="Enter Name" value={values.name} onChange={handleInputChange} />
                        </div>
                        <div className="input-box">
                            <div className="details">Price</div>
                            <input type="text" name="price" required placeholder="Enter Price" value={values.price} onChange={handleInputChange} />
                        </div>
                        <div className="input-box">
                            <div className="details">Description</div>
                            <textarea name="description" required placeholder="Enter Description" value={values.description} onChange={(handleInputChange)} />
                        </div>
                        <div className="input-box">
                            <div className="details">Category</div>
                            <StyledWrapperCategory>
                                <div className="my-form">
                                    <div>
                                        <input
                                            id="check-1"
                                            type="radio"
                                            name="category"
                                            value="Textbook"
                                            onChange={handleInputChange}
                                            checked={values.category === "Textbook"}
                                        />
                                        <label htmlFor="check-1">Textbook</label>
                                    </div>
                                    <div>
                                        <input
                                            id="check-2"
                                            type="radio"
                                            name="category"
                                            value="Tickets"
                                            onChange={handleInputChange}
                                            checked={values.category === "Tickets"}
                                        />
                                        <label htmlFor="check-2">Tickets</label>
                                    </div>
                                    <div>
                                        <input
                                            id="check-3"
                                            type="radio"
                                            name="category"
                                            value="Electronics"
                                            onChange={handleInputChange}
                                            checked={values.category === "Electronics"}
                                        />
                                        <label htmlFor="check-3">Electronics</label>
                                    </div>
                                    <div>
                                        <input
                                            id="check-4"
                                            type="radio"
                                            name="category"
                                            value="Furniture"
                                            onChange={handleInputChange}
                                            checked={values.category === "Furniture"}
                                        />
                                        <label htmlFor="check-4">Furniture</label>
                                    </div>
                                    <div>
                                        <input
                                            id="check-5"
                                            type="radio"
                                            name="category"
                                            value="Miscellaneous"
                                            onChange={handleInputChange}
                                            checked={values.category === "Miscellaneous"}
                                        />
                                        <label htmlFor="check-5">Miscellaneous</label>
                                    </div>
                                </div>
                            </StyledWrapperCategory>

                        </div>
                        <div className="input-box">
                            <div className="details">Condition</div>
                            <StyledWrapperCondition>
                                <div className="radio-inputs">
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Excellent"
                                            onChange={handleInputChange}
                                            checked={values.condition === "Excellent"}
                                        />
                                        <span className="name">Excellent</span>
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Great"
                                            onChange={handleInputChange}
                                            checked={values.condition === "Great"}
                                        />
                                        <span className="name">Great</span>
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Fair"
                                            onChange={handleInputChange}
                                            checked={values.condition === "Fair"}
                                        />
                                        <span className="name">Fair</span>
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Poor"
                                            onChange={handleInputChange}
                                            checked={values.condition === "Poor"}
                                        />
                                        <span className="name">Poor</span>
                                    </label>
                                </div>
                            </StyledWrapperCondition>
                        </div>
                        <div className="file-input-wrapper">
                            <div className="file-input">
                                <span className="details">Product Photo</span>
                                <label className="custum-file-upload" htmlFor="file">
                                    <div className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
                                            <path
                                                fill=""
                                                d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div className="text">
                                        <span>Click to upload image</span>
                                    </div>
                                    <input type="file" id="file" ref={fileInputRef} onChange={handleFileChange} onClick={handleFileClick} />
                                </label>
                            </div>

                            {/* Image preview */}
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Image preview" />
                                </div>
                            )}
                        </div>
                        <div className="form_footer">
                            <button type="button" className="btn btn-danger" onClick={() => toggleModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

const StyledWrapperCondition = styled.div`
  .radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #EEE;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 300px;
    font-size: 14px;
  }
  .radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
  }
  .radio-inputs .radio input {
    display: none;
  }
  .radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: .5rem 0;
    color: rgba(51, 65, 85, 1);
    transition: all .15s ease-in-out;
  }
  .radio-inputs .radio input:checked + .name {
    background-color: #fff;
    font-weight: 600;
  }
`;

const StyledWrapperCategory = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 5px;
  .my-form {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 5px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 250px;
  }
  .radio-wrapper {
    display: flex;
    align-items: center;
  }
  input[type="radio"] {
    accent-color: #4caf50;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    cursor: pointer;
  }
  label {
    font-size: 14px;
    color: #333;
    cursor: pointer;
    &:hover {
      color: #4caf50;
    }
  }
`;

export default AddProductModal;
