// controllers/booking.js
import Booking from "../model/booking.js";
export const createBooking = async (req, res) => {
  try {
    const { resourceId, startTime, endTime } = req.body;
    if (!resourceId || !startTime || !endTime) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "All fields required" } });
    if (new Date(endTime) <= new Date(startTime)) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "End must be after start" } });
    // Overlap check - race safety er main logic
    const overlap = await Booking.findOne({
      resourceId, status: "CONFIRMED",
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) }
    });
    if (overlap) return res.status(409).json({ error: { code: "BOOKING_CONFLICT", message: "Slot already booked" } });
    const booking = await Booking.create({ resourceId, userId: req.user._id, startTime, endTime });
    res.status(201).json(booking);
  } catch (e) { res.status(500).json({ error: { code: "INTERNAL_ERROR", message: e.message } }); }
};
export const getMyBookings = async (req, res) => { res.json(await Booking.find({ userId: req.user._id }).populate("resourceId").sort({ startTime: 1 })); };
export const getAllBookings = async (req, res) => { res.json(await Booking.find().populate("resourceId").populate("userId", "name email").sort({ startTime: 1 })); };
export const cancelBooking = async (req, res) => {
  const b = await Booking.findById(req.params.id);
  if (!b) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Booking not found" } });
  if (b.userId.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" } });
  b.status = "CANCELLED"; await b.save(); res.json(b);
};