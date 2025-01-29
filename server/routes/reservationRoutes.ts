import { Router } from "express";
import { authMiddleware, isAdmin, isUser } from "../middleware/authMiddleware";
import { changeReservationStatus, createReservation, getAllReservations, getReservation, getUserReservations } from "../controllers/reservationController";

const reservationRoutes = Router();


reservationRoutes.get("/user", authMiddleware, isUser, getUserReservations);
reservationRoutes.get("/admin", authMiddleware, isAdmin, getAllReservations);

reservationRoutes.get("/:id", authMiddleware, getReservation);

reservationRoutes.post("/", authMiddleware, isUser, createReservation);

reservationRoutes.patch("/status/:id", authMiddleware, isAdmin, changeReservationStatus);

export default reservationRoutes;
