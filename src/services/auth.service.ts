import axios from "axios";

/**
 * Cliente HTTP centralizado para la API backend
 * Permite cambiar URL según entorno (dev, prod)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL desde .env
  headers: {
    "Content-Type": "application/json",
  },
});

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

export default api;
