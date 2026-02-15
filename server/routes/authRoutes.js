import express from "express";
import { userLogin,signupUser } from "../controllers/authController.js";
import { signUpValidation, loginValidation } from "../middleware/validation.js";

const router = express.Router();

router.post("/login", loginValidation, userLogin);
router.post("/signup", signUpValidation, signupUser);

export default router;