import axios from 'axios';

const API_URL = 'https://twendeapi.afrimetrik.com/admin';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

export const fetchUsers = async (token) => {
    const response = await axios.get(`${API_URL}/users`, {
        Headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const fetchTrips = async (token) => {
    const response = await axios.get(`${API_URL}/rides`, {
        Headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const fetchVehicleTypes = async (token) => {
    const response = await axios.get(`${API_URL}/vehicle-types`, {
        Headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};



export const createVehicleType = async (data, token) => {
    const response = await axios.post(`${API_URL}/vehicle-types`, data, {
        Headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateVehicleType = async (id, data, token) => {
    const response = await axios.put(`${API_URL}/vehicle-types/${id}`, data, {
        Headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const deleteVehicleType = async (id, token) => {
    const response = await axios.delete(`${API_URL}/vehicle-types/${id}`, {
        Headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
