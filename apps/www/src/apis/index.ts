import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const axiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
});

export default axiosInstance;
