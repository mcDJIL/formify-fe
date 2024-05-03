import axios from "axios";
import { sessionToken } from "../Constants/localStorage";

const client = axios.create({
    baseURL: 'https://formify-api-production.up.railway.app/api/v1/'
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem(sessionToken);

    config.headers = {
        Authorization: `Bearer ${token}`
    }

    console.log(config);

    return config;
}, error => {
    return console.error(error);
});

export default client;