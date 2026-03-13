import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import ConnectDB from "./config/db.js";
import router from "./routes/otpRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.DB_port || 3000;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10
});

app.disable("x-powered-by");

app.use(cors({
  origin: ["http://localhost:5173","https://smart-secured-locker-1fz5h74ni-akashyatinjains-projects.vercel.app"],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(limiter);
app.use(express.json());

app.use("/api", router);
app.use("/api/auth", authRoutes);

app.get("/", (req,res)=>{
   res.send("Server working OK");
});

app.use(errorHandler);

ConnectDB().then(()=>{
   app.listen(port, ()=>{
      console.log(`Server running on ${port}`);
   });
});