import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import authRoutes from "./routes/auth.js";
import ticketRoutes from "./routes/ticket.js";
import resourceRoutes from "./routes/resource.js";
import bookingRoutes from "./routes/booking.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((req, res) => res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } }));
app.use((err, req, res, next) => { console.log(err); res.status(500).json({ error: { code: "INTERNAL_ERROR", message: err.message } }); });

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server is running on ${PORT}`)));