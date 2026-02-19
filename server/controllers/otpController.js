import GenerateOTP from "../utils/generateOTP.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import User from "../models/userModel.js";


// export const createOTP = async (req,res)=>{
//     const otp = GenerateOTP();
//     User.otpHash = await bcrypt.hash(otp.toString(),10);
//     User.otpExpriy = Date.now() + 60000;
//     User.attemptCount = 0;
//     User.LockerStatus = "LOCKED";

//      await User.save();
//     console.log("OTP created",otp)
//     res.json({message:"OTP generated",success: true});
// }

export const createOTP = async (req,res)=>{

   const otp = GenerateOTP();

   const user = await User.findById(req.user.id);

   user.otpHash = await bcrypt.hash(otp.toString(),12);
   user.otpExpriy = Date.now() + 60000;
   user.attemptCount = 0;
   user.LockerStatus = "LOCKED";

   await user.save();

   if(process.env.NODE_ENV === "development"){
      console.log("OTP created:", otp);
   }

   res.json({message:"OTP generated",success:true});
}

// export const verifyOTP = async (req,res)=>{
//    const { otp } = req.body || {};
//    if(!otp){
//    return res.json({message:"OTP required"});
// }

//  const errors = validationResult(req);
//    if(!errors.isEmpty()){
//       return res.json({ errors: errors.array() });
//    }

// const user = await User.findById(req.user.id);   const match = await bcrypt.compare(
//    otp.toString(),
//    user.otpHash
// );
//    if(Date.now() > user.otpExpriy ){
//     return res.json({message:"OTP Expired"});
//    }
//    if(user.attemptCount >= 3){
//       return res.json({message:"Too many attempts"});
//    }
// user.attemptCount++;

//    if(match){

//    user.LockerStatus = "UNLOCKED";

//    await user.save();

//    return res.json({
//       success:true,
//       message:"Locker Unlocked"
//    });
// }else {

//    await user.save();

//    return res.json({
//       success:false,
//       message:"Wrong OTP"
//    });
// }
// }
export const verifyOTP = async (req,res)=>{

   const { otp } = req.body || {};

   if(!otp){
      return res.json({message:"OTP required"});
   }

   const errors = validationResult(req);
   if(!errors.isEmpty()){
      return res.json({ errors: errors.array(),message:"Please insert vaild otp" });
   }

   


   const user = await User.findById(req.user.id);

   if(user.otpExpriy && Date.now() < user.otpExpriy){
      return res.status(429).json({message:"OTP already active"});
   }
   if(!user){
      return res.status(404).json({message:"User not found"});
   }

   if(!user.otpHash){
      return res.json({message:"No active OTP"});
   }

   if(Date.now() > user.otpExpriy){
      return res.json({message:"OTP Expired"});
   }

   if(user.attemptCount >= 3){
      return res.json({message:"Too many attempts"});
   }

   user.attemptCount++;

   const match = await bcrypt.compare(
      otp.toString(),
      user.otpHash
   );

   if(match){

      user.LockerStatus = "UNLOCKED";

      // 🔥 one-time-use OTP
      user.otpHash = null;
      user.otpExpriy = null;
      user.attemptCount = 0;

      await user.save();

      return res.json({
         success:true,
         message:"Locker Unlocked"
      });

   } else {

      await user.save();

      return res.json({
         success:false,
         message:"Wrong OTP"
      });
   }
}