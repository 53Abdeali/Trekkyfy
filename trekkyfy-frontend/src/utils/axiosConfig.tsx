import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://trekkyfy.onrender.com/api', 
  withCredentials: true, 
});

export default axiosInstance;