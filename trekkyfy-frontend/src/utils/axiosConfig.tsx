import axios from "axios";

const baseURL = "https://trekkyfy.onrender.com/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;
