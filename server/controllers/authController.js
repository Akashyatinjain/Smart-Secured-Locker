import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt, { hash } from "bcrypt";
import asyncHandler from "../utils/asyncHandler.js";

export const signupUser = asyncHandler(async (req,res)=>{

   const {username,email,password} = req.body;

   if(!username || !email || !password){
      return res.status(400).json({
         message:"All fields required"
      });
   }

   const normalizedEmail = email.toLowerCase();

   const existingUser = await User.findOne({
      email: normalizedEmail
   });

   if(existingUser){
      return res.status(400).json({
         message:"User already exists"
      });
   }

   const HashPassword = await bcrypt.hash(password,12);

   const user = await User.create({
      username,
      email: normalizedEmail,
      password: HashPassword
   });

   const token = generateToken(user._id);

   res.status(201).json({
      message:"Signup successful",
      token,
      user:{
         id:user._id,
         username:user.username,
         email:user.email
      }
   });
});


export const userLogin = asyncHandler(async (req,res)=>{

   const {email,password} = req.body;
   const normalizedEmail = email.toLowerCase();

   const user = await User.findOne({email: normalizedEmail});

   if(!user){
      return res.status(401).json({
         message:"Invalid email or password"
      });
   }

   await new Promise(r => setTimeout(r,300));

   const match = await bcrypt.compare(password,user.password);

   if(!match){
      return res.status(401).json({
         message:"Invalid email or password"
      });
   }

   const token = generateToken(user._id);

   res.status(200).json({
      message:"Login Successful",
      token
   });
});