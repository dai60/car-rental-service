import { Router } from "express";
import { authMiddleware, isUser } from "../middleware/authMiddleware";
import { createReservation, getUserReservations } from "../controllers/reservationController";

const reservationRoutes = Router();

reservationRoutes.get("/user", authMiddleware, isUser, getUserReservations);
reservationRoutes.post("/", authMiddleware, isUser, createReservation);

export default reservationRoutes;
