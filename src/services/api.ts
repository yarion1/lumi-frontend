import axios from 'axios';

const api = axios.create({
    baseURL: 'https://lumi-backend-l6w4.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
