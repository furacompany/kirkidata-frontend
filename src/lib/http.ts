import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.kirkidata.ng";
const API_VERSION = import.meta.env.VITE_API_VERSION ?? "v1";

export const http = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
});

function getAuthToken(): string | null {
  // Get the access token from localStorage (user token)
  return localStorage.getItem("accessToken");
}

http.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
