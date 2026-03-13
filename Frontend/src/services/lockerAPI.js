import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-secured-locker.onrender.com/api"
});

API.interceptors.request.use((req)=>{
  const token = localStorage.getItem("token");
  if(token){
     req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const generateOTP = () => API.post("/generate-otp");

export const getLockerStatus = () => API.get("/locker-status");