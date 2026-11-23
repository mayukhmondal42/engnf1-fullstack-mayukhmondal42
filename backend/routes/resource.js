import express from "express";
import { createResource, getResources, deleteResource } from "../controllers/resource.js";
import { protect, adminOnly } from "../middleware/auth.js";
const router = express.Router();
router.post("/", protect, adminOnly, createResource);
router.get("/", protect, getResources);
router.delete("/:id", protect, adminOnly, deleteResource);
export default router;