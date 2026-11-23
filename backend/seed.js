import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./database/db.js";
import User from "./model/user.js";
import Resource from "./model/resource.js";
import Ticket from "./model/ticket.js";

dotenv.config();

const run = async () => {
  await connectDB();
  await User.deleteMany({});
  await Resource.deleteMany({});
  await Ticket.deleteMany({});

  const adminPass = await bcrypt.hash("Admin@123", 10);
  const userPass = await bcrypt.hash("User@123", 10);

  await User.create([
    { name: "Admin", email: "admin@triagesync.test", passwordHash: adminPass, role: "ADMIN" },
    { name: "Test User", email: "user@triagesync.test", passwordHash: userPass, role: "USER" }
  ]);

  await Resource.create([
    { name: "Meeting Room A", type: "ROOM", capacity: 10, location: "Floor 2" },
    { name: "Projector 1", type: "EQUIPMENT", capacity: 1, location: "Floor 1" },
    { name: "Support Engineer", type: "STAFF", capacity: 1, location: "Remote" }
  ]);

  await Ticket.create([
    { externalId: "T-1001", title: "Refund not received for order", description: "I paid but refund not received", category: "BILLING", priority: "HIGH", status: "OPEN" },
    { externalId: "T-1002", title: "Cannot login with OTP", description: "OTP not coming", category: "LOGIN", priority: "HIGH", status: "OPEN" },
    { externalId: "T-1003", title: "App crashes on open", description: "App crashes", category: "BUG", priority: "URGENT", status: "OPEN" }
  ]);

  console.log("Seed done - admin@triagesync.test / Admin@123");
  console.log("Seed done - user@triagesync.test / User@123");
  process.exit(0);
};

run();