import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
const authMiddleware = async (req, res, next) => {
  try {
    // const token = req.header("Authorization")?.split(" ")[1];
    const {token}= req.headers; 

    console.log("Token received:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = await User.findById(decoded.userId).select("-password"); 

    next(); 
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;