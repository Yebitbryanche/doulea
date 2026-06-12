// config/apiConfig.js

// Replace this with your actual live public Railway domain
const PRODUCTION_URL = 'https://douleia-production.up.railway.app'; 

// Replace this with your computer's local network IP address for local debugging
// Run 'ipconfig' (Windows) or 'ifconfig' (Mac) to find it. Do not use 'localhost'.
const DEVELOPMENT_URL = 'http://192.168.43.252:8000'; 

export const API_BASE_URL = __DEV__ ? DEVELOPMENT_URL : PRODUCTION_URL;