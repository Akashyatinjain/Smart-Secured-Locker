import generatePasskey from "../utils/generatePasskey.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import OtpHistory from "../models/otpHistoryModel.js";

export const createPasskey = async (req, res) => {
   const user = await User.findById(req.user.id);

   const passkey = generatePasskey();

   user.passkeyHash = await bcrypt.hash(passkey.toString(), 12);

   await user.save();

   res.json({
      success: true,
      message: "Passkey generated",
      passkey
   });
};

export const unlockWithPasskey = async (req, res) => {
   try {
      console.log("BODY:", req.body); // 🔥 DEBUG
      console.log("REQ USER:", req.user);

      const { passkey } = req.body;

      // ✅ SAFETY CHECK
      if (!passkey) {
         return res.status(400).json({
            message: "Passkey is required"
         });
      }

      if (!req.user || !req.user.id) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      if (!user.passkeyHash) {
         return res.status(400).json({
            message: "No passkey set"
         });
      }

      // ✅ SAFE COMPARE
      const match = await bcrypt.compare(
         String(passkey),
         String(user.passkeyHash)
      );

      if (!match) {
         await OtpHistory.create({
            user: user._id,
            status: "PASSKEY_FAILED",
            deviceId: user.deviceId
         });

         return res.json({
            success: false,
            message: "Invalid passkey"
         });
      }

      user.LockerStatus = "UNLOCKED";
      await user.save();

      await OtpHistory.create({
         user: user._id,
         status: "PASSKEY_SUCCESS",
         deviceId: user.deviceId
      });

      setTimeout(async () => {
         const updatedUser = await User.findById(user._id);
         if (updatedUser) {
            updatedUser.LockerStatus = "LOCKED";
            await updatedUser.save();
         }
      }, 10000);

      return res.json({
         success: true,
         message: "Locker unlocked using passkey"
      });

   } catch (error) {
      console.error("PASSKEY ERROR:", error);
      res.status(500).json({ message: "Internal server error" });
   }
};