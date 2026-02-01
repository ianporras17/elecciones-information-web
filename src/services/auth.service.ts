import axios from "axios";

/**
 * Cliente HTTP centralizado para la API backend
 * Permite cambiar URL según entorno (dev, prod)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor para agregar el JWT automáticamente en cada request
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * (Recomendado) Auto-logout si el backend responde 401
 * - Limpia token y user
 * - Redirige al login
 */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

/**
 * Registro de administrador
 */
export const registerAdmin = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

/**
 * Login de administrador
 */
export const loginAdmin = async (data: {
  identifier: string; // username o email
  password: string;
}) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

/**
 * Logout manual (desde botón)
 */
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

export default api;
