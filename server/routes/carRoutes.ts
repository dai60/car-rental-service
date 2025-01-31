import { Router } from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import { addNewCar, deleteCar, getAllCars, getCar, updateCar } from "../controllers/carController";

const carRoutes = Router();

carRoutes.get("/", authMiddleware, getAllCars);
carRoutes.get("/:id", authMiddleware, getCar);

carRoutes.post("/", authMiddleware, isAdmin, addNewCar);

carRoutes.put("/:id", authMiddleware, isAdmin, updateCar);
carRoutes.delete("/:id", authMiddleware, isAdmin, deleteCar);

export default carRoutes;
