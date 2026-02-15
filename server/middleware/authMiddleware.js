import jwt from "jsonwebtoken";


const protect=(req, res, next)  =>{
    let token;
    if(
        req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_sec);
            req.user = decoded;

         next();
         return;
        }
        catch(error){
            return res.status(401).json({
                message: "Not authorized, token failed"
            });
        }
    }
    if (!token) {
      return res.status(401).json({
         message: "No token, access denied"
      });
   }
    
} 
export default protect;