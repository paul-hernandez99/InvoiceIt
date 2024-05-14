import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    // Additional headers can be set here if required
});

export default instance;