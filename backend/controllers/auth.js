import bcrypt from "bcryptjs";
import User from "../model/user.js";
import generateToken from "../jwt/generateToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Email and password required" } });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: { code: "CONFLICT", message: "Email already exists" } });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user) });
  } catch (e) { res.status(500).json({ error: { code: "INTERNAL_ERROR", message: e.message } }); }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user) });
  } catch (e) { res.status(500).json({ error: { code: "INTERNAL_ERROR", message: e.message } }); }
};

export const me = async (req, res) => { res.json(req.user); };