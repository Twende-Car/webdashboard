import axios from 'axios';

const API_URL = 'http://localhost:3000/admin';

export const fetchStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

export const fetchUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

export const fetchTrips = async () => {
    const response = await axios.get(`${API_URL}/rides`);
    return response.data;
};

export const fetchVehicleTypes = async () => {
    const response = await axios.get(`${API_URL}/vehicle-types`);
    return response.data;
};

export const createVehicleType = async (data) => {
    const response = await axios.post(`${API_URL}/vehicle-types`, data);
    return response.data;
};

export const updateVehicleType = async (id, data) => {
    const response = await axios.put(`${API_URL}/vehicle-types/${id}`, data);
    return response.data;
};

export const deleteVehicleType = async (id) => {
    const response = await axios.delete(`${API_URL}/vehicle-types/${id}`);
    return response.data;
};
