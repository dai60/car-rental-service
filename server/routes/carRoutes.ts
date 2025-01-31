import { Router } from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import { addNewCar, deleteCar, getAllCars, getCar, updateCar } from "../controllers/carController";
import { upload } from "../middleware/uploadMiddleware";

const carRoutes = Router();

carRoutes.get("/", authMiddleware, getAllCars);
carRoutes.get("/:id", authMiddleware, getCar);

carRoutes.post("/", authMiddleware, isAdmin, upload.single("image"), addNewCar);

carRoutes.put("/:id", authMiddleware, isAdmin, upload.single("image"), updateCar);
carRoutes.delete("/:id", authMiddleware, isAdmin, deleteCar);

export default carRoutes;
