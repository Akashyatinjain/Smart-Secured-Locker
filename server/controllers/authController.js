import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt, { hash } from "bcrypt";


export const signupUser =async (req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
   return res.json({message:"All fields required"});
}
const existingUser = await User.findOne({email});
if(existingUser){
   return res.json({message:"User already exists"});
}
    const HashPassword = await bcrypt.hash(password,10);

    const user = await User.create({
      username,
      email,
      password: HashPassword
    });
    res.json({
   message:"Signup successful",
   user:{
      id:user._id,
      username:user.username,
      email:user.email
   }
});
}


export const userLogin = async (req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.json({message:"User not found or please SignUp "});
    }

    const match = await bcrypt.compare(password,user.password);
    if(!match){
      return res.json({message:"Invalid password"});
    }
    const token = generateToken(user._id);

    res.json({
        message:"Login Succesfull",
        token
    })
}


