import axios from "axios";

const API_URL = 'http://localhost:8080/products';

export async function addProduct(product){
    return await axios.post(API_URL,product);
}
export async function getProducts(page = 0, size = 10){
    return await axios.get(`${API_URL}?page=${page}&size=${size}`);
}
export async function getMyProducts(page = 0, size = 10){
    return await axios.get(`${API_URL}/myProducts?page=${page}&size=${size}`)
}
export async function getProduct(id){
    return await axios.get(`${API_URL}/${id}`);
}
export async function updateProduct(product){
    return await axios.post(`${API_URL}/${id}`,product);
}
export async function updatePhoto(formData){
    return await axios.put(`${API_URL}/image`,formData);
}
export async function deleteProduct(id){
    return await axios.delete(`${API_URL}/${id}`);
}