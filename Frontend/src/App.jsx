import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import LoginPage from "./pages/Login";
import './index.css'
import SignupPage from "./pages/SignUp";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;