import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No token" } });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-passwordHash");
    if (!req.user) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "User not found" } });
    next();
  } catch {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid token" } });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ error: { code: "FORBIDDEN", message: "Admin only" } });
  next();
};