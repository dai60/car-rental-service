import { Request, Response } from "express";
import Reservation from "../models/Reservation";

export const getUserReservations = async (req: Request, res: Response): Promise<void> => {
    try {
        const reservations = await Reservation
            .find({ user: req.user?.id })
            .sort({ date: 1 })
            .populate("equipment");
        res.status(200).json(reservations);
    }
    catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
}

export const createReservation = async (req: Request, res: Response): Promise<void> => {
    const user = req.user?.id;
    const { equipment, date } = req.body;

    try {
        const reservation = await Reservation.create({ user, equipment, date });
        res.status(200).json(reservation);
    }
    catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
}
