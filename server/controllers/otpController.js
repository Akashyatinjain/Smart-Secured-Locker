import GenerateOTP from "../utils/generateOTP.js";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import OtpHistory from "../models/otpHistoryModel.js";

/* =========================
   GET LOCKER STATUS
========================= */
export const getLockerStatus = async (req, res) => {
const user = await User.findById(req.user.id);
   if (!user) {
      return res.status(404).json({ message: "User not found" });
   }

   res.json({
      success: true,
      lockerStatus: user.LockerStatus
   });
};

/* =========================
   GENERATE OTP
========================= */
export const createOTP = async (req, res) => {
const user = await User.findById(req.user.id);
   if (!user) {
      return res.status(404).json({ message: "User not found" });
   }

   const otp = GenerateOTP();

   // 🔐 Save OTP hash
   user.otpHash = await bcrypt.hash(otp.toString(), 12);
   user.otpExpriy = Date.now() + 60000;
   user.attemptCount = 0;
   user.LockerStatus = "LOCKED";

   await user.save();

   // 📊 SAVE HISTORY (NO PLAIN OTP)
   await OtpHistory.create({
      user: user._id,
      status: "GENERATED",
      deviceId: user.deviceId
   });

   res.json({
      success: true,
      message: "OTP generated",
      otp // ⚠️ only for dev/testing
   });
};

/* =========================
   VERIFY OTP
========================= */
export const verifyOTP = async (req, res) => {
   const { otp, deviceId } = req.body || {};

   if (!otp || !deviceId) {
      return res.status(400).json({
         message: "OTP and deviceId required"
      });
   }

const user = await User.findById(req.user.id);
   if (!user) {
      return res.status(404).json({ message: "User not found" });
   }

   // ⏰ EXPIRED
   if (!user.otpExpriy || Date.now() > user.otpExpriy) {
      await OtpHistory.create({
         user: user._id,
         status: "EXPIRED",
         deviceId: user.deviceId
      });

      return res.status(400).json({ message: "OTP Expired" });
   }

   // ❌ NO OTP
   if (!user.otpHash) {
      return res.status(400).json({ message: "No active OTP" });
   }

   // ❌ TOO MANY ATTEMPTS
   if (user.attemptCount >= 3) {
      return res.status(400).json({ message: "Too many attempts" });
   }

   user.attemptCount++;

   const match = await bcrypt.compare(
      otp.toString(),
      user.otpHash
   );

   /* =========================
      SUCCESS
   ========================= */
   if (match) {
      user.LockerStatus = "UNLOCKED";

      user.otpHash = null;
      user.otpExpriy = null;
      user.attemptCount = 0;

      await user.save();

      // 📊 HISTORY
      await OtpHistory.create({
         user: user._id,
         status: "SUCCESS",
         deviceId: user.deviceId
      });

      // 🔐 Auto lock after 10 sec
      setTimeout(async () => {
         const updatedUser = await User.findById(user._id);
         if (updatedUser) {
            updatedUser.LockerStatus = "LOCKED";
            await updatedUser.save();
         }
      }, 10000);

      return res.json({
         success: true,
         message: "Locker Unlocked for 10 seconds"
      });
   }

   /* =========================
      FAILED
   ========================= */
   await user.save();

   await OtpHistory.create({
      user: user._id,
      status: "FAILED",
      deviceId: user.deviceId
   });

   return res.json({
      success: false,
      message: "Wrong OTP"
   });
};