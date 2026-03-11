import express from "express";
import { createOTP, verifyOTP } from "../controllers/otpController.js";
import { body } from "express-validator";
import protect from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/generate-otp",protect, createOTP);
router.post(
   "/verify-otp",
   protect,
   body("otp").isLength({max:6,min:6}),
   verifyOTP
);
router.get("/locker-status", protect, async (req,res)=>{

   const user = await User.findById(req.user.id);

   if(!user){
      return res.status(404).json({message:"User not found"});
   }

   res.json({
      status:user.LockerStatus
   });
});
export default router;