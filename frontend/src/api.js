// src/api.js
const API_URL = "http://localhost:4000/staff"; // adjust if different

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // assuming token stored after login
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// Fetch all staff
export const fetchStaff = async () => {
  const res = await fetch(API_URL, { headers: getAuthHeaders() });
  return res.json();
};

// Create staff
export const createStaff = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// Update staff
export const updateStaff = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// Toggle staff status
export const toggleStaffStatus = async (id) => {
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders()
  });
  return res.json();
};
