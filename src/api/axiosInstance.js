import axios from "axios";
const baseUrl = "http://localhost:5000/api";
const authBaseUrl = "http://localhost:5001/api";
const roomBaseUrl = "http://localhost:5005/api";
export const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
});
// export const userApi = axios.create({
//   baseURL: "http://localhost:5006/api",
//   timeout: 10000,
// });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//export default api;
