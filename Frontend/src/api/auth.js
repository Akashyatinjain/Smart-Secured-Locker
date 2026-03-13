import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-secured-locker.onrender.com/api"||import.meta.env.VITE_API_URL,
});

// SIGNUP
export const signupUser = (data) => API.post("/auth/signup", data);

// LOGIN
export const loginUser = (data) => API.post("/auth/login", data);