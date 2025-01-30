import { Router } from "express";
import { authMiddleware, isAdmin, isUser } from "../middleware/authMiddleware";
import * as controller from "../controllers/reservationController";

const reservationRoutes = Router();

reservationRoutes.get("/user", authMiddleware, isUser, controller.getUserReservations);
reservationRoutes.get("/admin", authMiddleware, isAdmin, controller.getAllReservations);

reservationRoutes.get("/for/:id", authMiddleware, controller.getReservationsFor);
reservationRoutes.get("/:id", authMiddleware, controller.getReservation);

reservationRoutes.post("/", authMiddleware, isUser, controller.createReservation);

reservationRoutes.patch("/date/:id", authMiddleware, isUser, controller.changeReservationDate);
reservationRoutes.patch("/status/:id", authMiddleware, isAdmin, controller.changeReservationStatus);

reservationRoutes.delete("/:id", authMiddleware, isUser, controller.cancelReservation);

export default reservationRoutes;
