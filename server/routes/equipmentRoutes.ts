import { Router } from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import { addNewEquipment, deleteEquipment, getAllEquipment, getEquipment, updateEquipment } from "../controllers/equipmentController";

const equipmentRoutes = Router();

equipmentRoutes.get("/", authMiddleware, getAllEquipment);
equipmentRoutes.get("/:id", authMiddleware, getEquipment);

equipmentRoutes.post("/", authMiddleware, isAdmin, addNewEquipment);

equipmentRoutes.put("/:id", authMiddleware, isAdmin, updateEquipment);
equipmentRoutes.delete("/:id", authMiddleware, isAdmin, deleteEquipment);

export default equipmentRoutes;
