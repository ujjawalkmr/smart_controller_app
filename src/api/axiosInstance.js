const baseUrl = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";



export const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
});
// export const userApi = axios.create({
//   baseURL: "http://localhost:5006/api",
//   timeout: 10000,
// });


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(
      new ApiException({
        message: error.message,
      }),
    );
  },
);

api.interceptors.response.use(
  (response) => {
    // Successful API response
    return response;
  },

  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject(
        new ApiException({
          response: null,
          networkError: false,
          message: "Request timeout",
          status: 408,
        }),
      );
    }
    // API returned response, but status is 4xx/5xx
    if (error.response) {
      return Promise.reject(
        new ApiException({
          response: error.response.data,
          networkError: false,
          message: error.response.data?.message || "API request failed",
          status: error.response.status,
        }),
      );
    }

    // Request was made but server didn't respond
    if (error.request) {
      return Promise.reject(
        new ApiException({
          response: null,
          networkError: true,
          message: "Network error. Server is not reachable.",
          status: null,
        }),
      );
    }

    // Something else happened
    return Promise.reject(
      new ApiException({
        response: null,
        networkError: false,
        message: error.message || "Request failed",
        status: null,
      }),
    );
  },
);


//export default api;
