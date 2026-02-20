import axios from 'axios';

export const API_URL = 'https://twendeapi.afrimetrik.com/admin';
export const WEB_URL = 'https://twendeapi.afrimetrik.com';

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

export const approveDriverWithId = async (id) => {
    const response = await axios.put(`${API_URL}/approve-driver/${id}`);
    return response.data;
};

export const fetchPendingDriversToValidate = async () => {
    const response = await axios.get(`${API_URL}/pending-drivers`);
    return response.data;
};

export const fetchUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

export const resetUserPassword = async (userId, newPassword) => {
    const response = await axios.post(`${API_URL}/users/${userId}/reset-password`, { newPassword });
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
    const response = await axios.delete(`${API_URL}/vehicle-types/${id}`, {
        Headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
    return response.data;
};

export const fetchDrivers = async () => {
    const response = await axios.get(`${API_URL}/users?role=driver`);
    return response.data;
};

export const creditDriver = async (driverId, amount) => {
    const response = await axios.post(`${API_URL}/credit-driver`, { driverId, amount });
    return response.data;
};

export const getCommission = async () => {
    const response = await axios.get(`${API_URL}/commission`);
    return response.data;
};

export const updateCommission = async (percentage) => {
    const response = await axios.post(`${API_URL}/commission`, { percentage });
    return response.data;
};
