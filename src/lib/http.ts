import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.kirkidata.ng";
const API_VERSION = import.meta.env.VITE_API_VERSION ?? "v1";

export const http = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
});

// Enhanced token management for both user and admin
function getAuthToken(isAdmin: boolean = false): string | null {
  if (isAdmin) {
    return localStorage.getItem("adminAccessToken");
  }
  return localStorage.getItem("accessToken");
}

// Request interceptor for user requests
http.interceptors.request.use((config) => {
  const token = getAuthToken(false);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create separate HTTP instance for admin requests
export const adminHttp = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
});

// Request interceptor for admin requests
adminHttp.interceptors.request.use((config) => {
  const token = getAuthToken(true);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for both instances
const createResponseInterceptor = (httpInstance: any, isAdmin: boolean = false) => {
  httpInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;

      // Handle network connectivity errors
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        const networkError = new Error('Please check your internet connection and try again.');
        networkError.name = 'NetworkError';
        return Promise.reject(networkError);
      }

      // Handle timeout errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        const timeoutError = new Error('Request timed out. Please check your internet connection and try again.');
        timeoutError.name = 'TimeoutError';
        return Promise.reject(timeoutError);
      }

      // Handle connection refused errors
      if (error.code === 'ERR_CONNECTION_REFUSED' || error.message?.includes('connection refused')) {
        const connectionError = new Error('Unable to connect to server. Please check your internet connection and try again.');
        connectionError.name = 'ConnectionError';
        return Promise.reject(connectionError);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = isAdmin 
            ? localStorage.getItem("adminRefreshToken")
            : localStorage.getItem("refreshToken");

          if (refreshToken) {
            const refreshResponse = await axios.post(`${API_BASE_URL}/api/${API_VERSION}/auth/refresh`, {
              refreshToken,
              role: isAdmin ? 'admin' : 'user'
            });

            if (refreshResponse.data.success) {
              const newToken = refreshResponse.data.data.accessToken;
              const newRefreshToken = refreshResponse.data.data.refreshToken;

              if (isAdmin) {
                localStorage.setItem("adminAccessToken", newToken);
                localStorage.setItem("adminRefreshToken", newRefreshToken);
              } else {
                localStorage.setItem("accessToken", newToken);
                localStorage.setItem("refreshToken", newRefreshToken);
              }

              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return httpInstance(originalRequest);
            }
          }
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          if (isAdmin) {
            localStorage.removeItem("adminAccessToken");
            localStorage.removeItem("adminRefreshToken");
            localStorage.removeItem("adminData");
            window.location.href = "/admin/login";
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");
            window.location.href = "/login";
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

createResponseInterceptor(http, false);
createResponseInterceptor(adminHttp, true);

export default http;
