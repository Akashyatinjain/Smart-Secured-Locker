import express from "express";
import { createOTP, verifyOTP } from "../controllers/otpController.js";
import { body } from "express-validator";
import protect from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

// router.post("/generate-otp",protect, createOTP);
// router.post(
//    "/verify-otp",
//    body("otp").isLength({ max: 6, min: 6 }),
//    verifyOTP
// );

router.post("/generate-otp", protect, createOTP); 

router.post("/verify-otp", verifyOTP);
// router.get("/locker-status", protect, async (req,res)=>{

//    const user = await User.findById(req.user.id);

//    if(!user){
//       return res.status(404).json({message:"User not found"});
//    }

//    res.json({
//       status:user.LockerStatus
//    });
// });

router.get("/locker-status", protect, async (req,res)=>{

   try{

      const user = await User.findById(req.user.id);

      if(!user){
         return res.status(404).json({
            success:false,
            message:"User not found"
         });
      }

      res.json({
         success:true,
         lockerStatus:user.LockerStatus
      });

   }catch(err){
      res.status(500).json({
         success:false,
         message:"Server error"
      });
   }
});
export default router;