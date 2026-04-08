import mongoose from "mongoose";

const otpHistorySchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
   },
   otp: {
      type: String // store plain ONLY for dev, otherwise hash
   },
   status: {
      type: String,
      enum: ["GENERATED", "SUCCESS", "FAILED", "EXPIRED"],
      default: "GENERATED"
   },
   deviceId: {
      type: String
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

const OtpHistory = mongoose.model("OtpHistory", otpHistorySchema);

export default OtpHistory;