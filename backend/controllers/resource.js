// controllers/resource.js
import Resource from "../model/resource.js";
export const createResource = async (req, res) => { const r = await Resource.create(req.body); res.status(201).json(r); };
export const getResources = async (req, res) => { res.json(await Resource.find().sort({ createdAt: -1 })); };
export const deleteResource = async (req, res) => { await Resource.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); };