import Ticket from "../model/ticket.js";
import TicketEvent from "../model/ticketEvent.js";

// Auto-classify logic
const classify = (title = "", description = "") => {
  const text = (title + " " + description).toLowerCase();
  if (text.includes("refund") || text.includes("bill") || text.includes("charge") || text.includes("payment")) return { category: "BILLING", priority: "HIGH" };
  if (text.includes("login") || text.includes("password") || text.includes("otp") || text.includes("cannot sign")) return { category: "LOGIN", priority: "HIGH" };
  if (text.includes("delivery") || text.includes("late") || text.includes("not delivered") || text.includes("package")) return { category: "DELIVERY", priority: "MEDIUM" };
  if (text.includes("crash") || text.includes("error") || text.includes("bug") || text.includes("not working")) return { category: "BUG", priority: "URGENT" };
  if (text.includes("feature") || text.includes("add") || text.includes("wish") || text.includes("suggest")) return { category: "FEATURE_REQUEST", priority: "MEDIUM" };
  return { category: "BUG", priority: "MEDIUM" };
};

export const importTickets = async (req, res) => {
  try {
    const { tickets } = req.body;
    if (!Array.isArray(tickets)) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "tickets must be an array" } });
    let created = 0, skipped = 0, duplicates = [];
    for (const t of tickets) {
      if (!t.id || !t.title) continue;
      const exists = await Ticket.findOne({ externalId: t.id });
      if (exists) { skipped++; duplicates.push(t.id); continue; }
      const { category, priority } = classify(t.title, t.description);
      const newTicket = await Ticket.create({
        externalId: t.id,
        title: t.title,
        description: t.description || "",
        category, priority,
        status: "OPEN"
      });
      await TicketEvent.create({ ticketId: newTicket._id, event: "IMPORTED", to: { category, priority } });
      created++;
    }
    res.status(201).json({ created, skipped, duplicates });
  } catch (e) { res.status(500).json({ error: { code: "INTERNAL_ERROR", message: e.message } }); }
};

export const getTickets = async (req, res) => {
  const { q, category, status, priority, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (q) filter.title = { $regex: q, $options: "i" };
  const skip = (page - 1) * limit;
  const tickets = await Ticket.find(filter).sort({ priority: 1, createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Ticket.countDocuments(filter);
  res.json({ data: tickets, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) } });
};

export const getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Ticket not found" } });
  const events = await TicketEvent.find({ ticketId: ticket._id }).sort({ createdAt: 1 });
  res.json({ ticket, events });
};

export const updateTicket = async (req, res) => {
  const { category, priority, status, categoryOverridden, note } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Ticket not found" } });
  const before = { category: ticket.category, priority: ticket.priority, status: ticket.status };
  if (category) ticket.category = category;
  if (priority) ticket.priority = priority;
  if (status) ticket.status = status;
  if (categoryOverridden !== undefined) ticket.categoryOverridden = categoryOverridden;
  await ticket.save();
  await TicketEvent.create({ ticketId: ticket._id, event: "UPDATED", from: before, to: { category: ticket.category, priority: ticket.priority, status: ticket.status }, actorId: req.user?._id, note });
  res.json(ticket);
};

export const getStats = async (req, res) => {
  const byCategory = await Ticket.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
  const byStatus = await Ticket.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
  const byPriority = await Ticket.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]);
  const total = await Ticket.countDocuments();
  res.json({ total, byCategory, byStatus, byPriority });
};