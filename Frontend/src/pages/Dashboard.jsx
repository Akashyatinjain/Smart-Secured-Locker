import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: "https://smart-secured-locker.onrender.com/api"
});

const Dashboard = () => {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [lockerStatus, setLockerStatus] = useState("Loading...");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Axios interceptor to attach token
  API.interceptors.request.use((req) => {
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  // Fetch locker status
  const fetchLockerStatus = async () => {
    try {

      const res = await API.get("/locker-status");

      setLockerStatus(res.data.lockerStatus);

    } catch (error) {

      console.log(error);

    }
  };

  // Generate OTP
  const handleGenerateOTP = async () => {

    try {

      setLoading(true);

      const res = await API.post("/generate-otp");

      setOtp(res.data.otp || "Check backend console");

      setLoading(false);

    } catch (error) {

      console.log(error);
      setLoading(false);

    }
  };

  // Logout
  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  useEffect(() => {

    fetchLockerStatus();

    // auto refresh locker status every 3 seconds
    const interval = setInterval(() => {
      fetchLockerStatus();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
          width: "400px"
        }}
      >
        <h1>🔐 Smart Secure Locker</h1>

        <h2>
          Locker Status :
          <span
            style={{
              color: lockerStatus === "UNLOCKED" ? "lightgreen" : "orange"
            }}
          >
            {" "}
            {lockerStatus}
          </span>
        </h2>

        <button
          onClick={handleGenerateOTP}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            fontSize: "16px",
            background: "#22c55e",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {loading ? "Generating..." : "Generate OTP"}
        </button>

        {otp && (
          <div style={{ marginTop: "25px" }}>
            <h3>Your OTP</h3>
            <h1 style={{ letterSpacing: "5px" }}>{otp}</h1>
            <p>OTP expires in 60 seconds</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            marginTop: "30px",
            padding: "10px 20px",
            background: "#ef4444",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;