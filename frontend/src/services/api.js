// frontend/src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/staff"; // your backend

const token = localStorage.getItem("token");

const config = { headers: { Authorization: `Bearer ${token}` } };

export const getAllStaff = () => axios.get(API_URL, config);
export const createStaff = (data) => axios.post(API_URL, data, config);
export const updateStaff = (id, data) => axios.put(`${API_URL}/${id}`, data, config);
export const toggleStaffStatus = (id) => axios.patch(`${API_URL}/${id}/status`, {}, config);
export const loginStaff = (data) => axios.post(`${API_URL}/login`, data);
