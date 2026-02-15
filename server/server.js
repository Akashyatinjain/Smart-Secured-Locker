import express from "express";
import ConnectDB from "./config/db.js"
import router from "./routes/otpRoutes.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";


const app = express();
const port = process.env.DB_port || 3000;
const limiter = rateLimit({
   windowMs:60*1000,
   max:10
})

app.use(helmet());
app.use(limiter);
app.use(express.json());

app.use("/api", router);
app.use("/auth", authRoutes);


app.get("/", (req,res)=>{
   res.send("Server working OK");
});

app.listen(port,(req,res)=>{
    ConnectDB();
    console.log(`Server is connect ${port}`);
})