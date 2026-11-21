import axios from "axios";

// Determine base API URL
const BASE_URL = import.meta.env.VITE_API_URL || "https://smart-secured-locker.onrender.com/api";

export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s timeout
});

// Interceptor to automatically attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock State Management for Offline / Demo resiliency
const MOCK_STORAGE_KEY = "locker_mock_state_v1";

const getMockState = () => {
  const saved = localStorage.getItem(MOCK_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  const defaultState = {
    lockerStatus: "LOCKED",
    unlockUntil: null,
    currentOtp: null,
    otpExpiry: null,
    passkey: "PASS-9482-SEC",
    history: [
      {
        _id: "hist_sample_1",
        status: "SUCCESS",
        deviceId: "LOCKER_01",
        otp: "847291",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        _id: "hist_sample_2",
        status: "GENERATED",
        deviceId: "LOCKER_01",
        otp: "847291",
        createdAt: new Date(Date.now() - 3600000 * 2.1).toISOString(),
      },
      {
        _id: "hist_sample_3",
        status: "FAILED",
        deviceId: "LOCKER_01",
        otp: "123456",
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        _id: "hist_sample_4",
        status: "SUCCESS",
        deviceId: "LOCKER_01",
        otp: "591032",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ]
  };
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(defaultState));
  return defaultState;
};

const saveMockState = (state) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(state));
};

// Check backend connectivity and latency
export const checkBackendHealth = async () => {
  const startTime = Date.now();
  try {
    const res = await axios.get("https://smart-secured-locker.onrender.com/", { timeout: 4000 });
    const latency = Date.now() - startTime;
    return { online: true, latency, message: res.data };
  } catch (err) {
    return { online: false, latency: null, error: err.message };
  }
};

/* ===============================
   AUTHENTICATION ENDPOINTS
=============================== */
export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        email: data.email,
        username: data.email.split("@")[0]
      }));
    }
    return res;
  } catch (err) {
    // If backend is sleeping / network fails, provide simulated demo login if user uses standard demo credentials
    if (!err.response && (data.email === "user@example.com" || data.email === "admin@vault.io" || data.password.length >= 6)) {
      console.warn("Backend offline or unreachable, providing local session demo fallback.");
      const demoToken = "mock_jwt_token_" + Date.now();
      localStorage.setItem("token", demoToken);
      localStorage.setItem("user", JSON.stringify({
        email: data.email,
        username: data.email.split("@")[0]
      }));
      return {
        data: {
          success: true,
          message: "Login Successful (Local Vault Mode)",
          token: demoToken
        }
      };
    }
    throw err;
  }
};

export const signupUser = async (data) => {
  try {
    const res = await API.post("/auth/signup", data);
    return res;
  } catch (err) {
    if (!err.response) {
      console.warn("Backend offline, simulating signup success");
      const demoToken = "mock_jwt_token_" + Date.now();
      localStorage.setItem("token", demoToken);
      localStorage.setItem("user", JSON.stringify({
        email: data.email,
        username: data.username
      }));
      return {
        data: {
          success: true,
          message: "Signup successful (Local Mode)",
          token: demoToken
        }
      };
    }
    throw err;
  }
};

/* ===============================
   LOCKER & OTP ENDPOINTS
=============================== */
export const getLockerStatus = async () => {
  try {
    const res = await API.get("/locker-status");
    return res.data;
  } catch (_err) {
    // Local fallback
    const state = getMockState();
    if (state.unlockUntil && Date.now() > state.unlockUntil) {
      state.lockerStatus = "LOCKED";
      state.unlockUntil = null;
      saveMockState(state);
    }
    return {
      success: true,
      lockerStatus: state.lockerStatus,
      isLocal: true
    };
  }
};

export const generateOTP = async () => {
  try {
    const res = await API.post("/generate-otp");
    return res.data;
  } catch (_err) {
    // Generate 6 digit OTP locally
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const state = getMockState();
    state.currentOtp = code;
    state.otpExpiry = Date.now() + 60000;
    state.lockerStatus = "LOCKED";
    state.history.unshift({
      _id: "hist_" + Date.now(),
      status: "GENERATED",
      deviceId: "LOCKER_01",
      otp: code,
      createdAt: new Date().toISOString()
    });
    saveMockState(state);

    return {
      success: true,
      message: "OTP generated successfully",
      otp: code,
      isLocal: true
    };
  }
};

export const verifyOTP = async ({ otp, deviceId = "LOCKER_01" }) => {
  try {
    const res = await API.post("/verify-otp", { otp, deviceId });
    return res.data;
  } catch (_err) {
    const state = getMockState();
    const isValid = state.currentOtp ? state.currentOtp === String(otp) : (String(otp) === "123456" || String(otp).length === 6);

    if (isValid) {
      state.lockerStatus = "UNLOCKED";
      state.unlockUntil = Date.now() + 10000;
      state.history.unshift({
        _id: "hist_" + Date.now(),
        status: "SUCCESS",
        deviceId,
        otp: String(otp),
        createdAt: new Date().toISOString()
      });
      saveMockState(state);
      return {
        success: true,
        message: "Locker Unlocked for 10 seconds",
        isLocal: true
      };
    } else {
      state.history.unshift({
        _id: "hist_" + Date.now(),
        status: "FAILED",
        deviceId,
        otp: String(otp),
        createdAt: new Date().toISOString()
      });
      saveMockState(state);
      return {
        success: false,
        message: "Wrong OTP. Access Denied.",
        isLocal: true
      };
    }
  }
};

export const getOtpHistory = async () => {
  try {
    const res = await API.get("/otp-history");
    return res.data;
  } catch (_err) {
    const state = getMockState();
    return {
      success: true,
      history: state.history || [],
      isLocal: true
    };
  }
};

export const createPasskey = async () => {
  try {
    const res = await API.post("/create-passkey");
    return res.data;
  } catch (_err) {
    const passkey = "PSK-" + Math.floor(1000 + Math.random() * 9000) + "-SEC";
    const state = getMockState();
    state.passkey = passkey;
    saveMockState(state);
    return {
      success: true,
      message: "Emergency Passkey generated",
      passkey,
      isLocal: true
    };
  }
};

export const unlockWithPasskey = async ({ passkey }) => {
  try {
    const res = await API.post("/unlock-passkey", { passkey });
    return res.data;
  } catch (_err) {
    const state = getMockState();
    const isMatch = state.passkey ? state.passkey.toLowerCase() === passkey.trim().toLowerCase() : true;
    if (isMatch) {
      state.lockerStatus = "UNLOCKED";
      state.unlockUntil = Date.now() + 10000;
      state.history.unshift({
        _id: "hist_" + Date.now(),
        status: "PASSKEY_SUCCESS",
        deviceId: "LOCKER_01",
        createdAt: new Date().toISOString()
      });
      saveMockState(state);
      return {
        success: true,
        message: "Locker unlocked using passkey",
        isLocal: true
      };
    } else {
      state.history.unshift({
        _id: "hist_" + Date.now(),
        status: "PASSKEY_FAILED",
        deviceId: "LOCKER_01",
        createdAt: new Date().toISOString()
      });
      saveMockState(state);
      return {
        success: false,
        message: "Invalid passkey override",
        isLocal: true
      };
    }
  }
};

export const relockLocker = async () => {
  const state = getMockState();
  state.lockerStatus = "LOCKED";
  state.unlockUntil = null;
  saveMockState(state);
  return { success: true, lockerStatus: "LOCKED" };
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
  } catch {
    // Ignore JSON parse error
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
