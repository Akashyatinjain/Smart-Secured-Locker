import express from "express";
import { userLogin,signupUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/login",userLogin);
router.post("/signup", signupUser);

export default router;