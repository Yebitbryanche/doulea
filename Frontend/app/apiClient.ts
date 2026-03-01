import axios from "axios"

const API_URL = "http://192.168.43.252:8000"; // or your IP for real devices

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;