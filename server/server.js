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

app.use(helmet()); // Helmet helps make your backend safer by preventing common web attacks like:

app.use(morgan("dev")); // Morgan is a logging middleware used in Express.js to record HTTP requests coming to your server.

app.use(limiter); // Limiter (usually called rate limiter) is middleware used to control how many requests a user can send to your server in a specific time period.

app.use(express.json()); // json FORMAT DATE

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