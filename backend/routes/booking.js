import express from "express";
import { createBooking, getMyBookings, getAllBookings, cancelBooking } from "../controllers/booking.js";
import { protect, adminOnly } from "../middleware/auth.js";
const router = express.Router();
router.post("/", protect, createBooking);
router.get("/mine", protect, getMyBookings);
router.get("/all", protect, adminOnly, getAllBookings);
router.delete("/:id", protect, cancelBooking);
export default router;