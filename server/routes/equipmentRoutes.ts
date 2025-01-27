import { Router } from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import { addNewEquipment, deleteEquipment, getEquipment } from "../controllers/equipmentController";

const equipmentRoutes = Router();

equipmentRoutes.get("/", authMiddleware, getEquipment);
equipmentRoutes.post("/", authMiddleware, isAdmin, addNewEquipment);
equipmentRoutes.delete("/:id", authMiddleware, isAdmin, deleteEquipment);

export default equipmentRoutes;
