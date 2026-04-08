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
   const { passkey } = req.body;

   const user = await User.findById(req.user.id);

   if (!user.passkeyHash) {
      return res.status(400).json({
         message: "No passkey set"
      });
   }

   const match = await bcrypt.compare(
      passkey.toString(),
      user.passkeyHash
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
};