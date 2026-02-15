import express from "express";
import ConnectDB from "./config/db.js"
import router from "./routes/otpRoutes.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";


const port = process.env.DB_port || 3000;
const limiter = rateLimit({
   windowMs:60*1000,
   max:10
})

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(morgan("dev"));

app.use(limiter);

app.use(express.json());

app.use("/api", router);
app.use("/auth", authRoutes);

app.get("/", (req,res)=>{
   res.send("Server working OK");
});

app.use(errorHandler);

// app.listen(port,(req,res)=>{
//     ConnectDB();
//     console.log(`Server is connect ${port}`);
// })

ConnectDB().then(()=>{
   app.listen(port, ()=>{
      console.log(`Server running on ${port}`);
   });
});