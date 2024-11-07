import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response Error:', error);
        try {
            const { response } = error;
            if (response && response.status === 401) {
                localStorage.removeItem("ACCESS_TOKEN"); 
            } 
        } catch (err) {
            console.error('Error Handling Error:', err);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
