import GenerateOTP from "../utils/generateOTP.js";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import OtpHistory from "../models/otpHistoryModel.js";

/* =========================
   GET LOCKER STATUS
========================= */
export const getLockerStatus = async (req, res) => {
   try {
      const user = await User.findById(req.user.id);

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      // 🔥 ADD THIS HERE (AUTO LOCK LOGIC)
      if (user.unlockUntil && Date.now() > user.unlockUntil) {
         user.LockerStatus = "LOCKED";
         user.unlockUntil = null;
         await user.save();
      }

      res.json({
         success: true,
         lockerStatus: user.LockerStatus
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
   }
};


/* =========================
   GENERATE OTP
========================= */
export const createOTP = async (req, res) => {
   try {
      if (!req.user?.id) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      const otp = GenerateOTP();

      user.otpHash = await bcrypt.hash(otp.toString(), 12);
      user.otpExpriy = Date.now() + 60000;
      user.attemptCount = 0;

      // 🔐 ALWAYS LOCK ON OTP GENERATE
      user.LockerStatus = "LOCKED";

      await user.save();

      await OtpHistory.create({
         user: user._id,
         status: "GENERATED",
         deviceId: user.deviceId
      });

      res.json({
         success: true,
         message: "OTP generated",
         otp // dev only
      });

   } catch (err) {
      console.error("CREATE OTP ERROR:", err);
      res.status(500).json({ message: "Server error" });
   }
};


/* =========================
   VERIFY OTP
========================= */
export const verifyOTP = async (req, res) => {
   try {
      const { otp, deviceId } = req.body;

      if (!otp || !deviceId) {
         return res.status(400).json({
            message: "OTP and deviceId required"
         });
      }

      if (!req.user?.id) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      /* =========================
         EXPIRED
      ========================= */
      if (!user.otpExpriy || Date.now() > user.otpExpriy) {
         await OtpHistory.create({
            user: user._id,
            status: "EXPIRED",
            deviceId: user.deviceId
         });

         return res.status(400).json({ message: "OTP Expired" });
      }

      /* =========================
         NO OTP
      ========================= */
      if (!user.otpHash) {
         return res.status(400).json({ message: "No active OTP" });
      }

      /* =========================
         ATTEMPT LIMIT
      ========================= */
      if (user.attemptCount >= 3) {
         return res.status(400).json({ message: "Too many attempts" });
      }

      user.attemptCount++;

      const match = await bcrypt.compare(
         String(otp),
         user.otpHash
      );

      /* =========================
         SUCCESS
      ========================= */
      if (match) {
         user.LockerStatus = "UNLOCKED";

         // clear OTP
         user.otpHash = null;
         user.otpExpriy = null;
         user.attemptCount = 0;

         // 🔥 IMPORTANT: store unlock expiry (better than setTimeout)
         user.unlockUntil = Date.now() + 10000;

         await user.save();

         await OtpHistory.create({
            user: user._id,
            status: "SUCCESS",
            deviceId: user.deviceId
         });

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

   } catch (err) {
      console.error("VERIFY OTP ERROR:", err);
      res.status(500).json({ message: "Server error" });
   }
};