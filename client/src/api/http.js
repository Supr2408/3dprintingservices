import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined. Add it in client .env.");
}

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

export default http;
