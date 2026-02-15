import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type :String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    otpHash:{
        type:String  
    },
    otpExpriy:{
        type:Number
    },
    attemptCount:{
        type:Number,
        default:0
    },
    LockerStatus:{
   type:String,
   default:"LOCKED"
   }
},{timestamps:true});

const User = mongoose.model("user",userSchema);

export default User;