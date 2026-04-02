import axios from "axios"
import * as securestore from 'expo-secure-store'

export const API_URL = "http://192.168.10.117:8000"; // or your IP for real devices

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) =>{
    const token = await securestore.getItemAsync('userToken');

    if(token){
      config.headers.Authorization = `Bearer ${token}`
      console.log(token)
    }

    return config
  },
  (error) => Promise.reject(error) 
)

export default apiClient;