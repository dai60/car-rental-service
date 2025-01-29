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

export const getReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const reservation = await Reservation
            .findById(req.params.id)
            .populate("equipment")
            .populate("user", "email");

        if (!reservation) {
            res.status(404).json({ error: "not found" });
            return;
        }

        if (reservation.user._id.equals(req.user?.id) || req.user?.admin) {
            res.status(200).json(reservation);
        }
        else {
            res.status(401).json({ error: "unauthorized access" });
        }
    }
    catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
}

export const getAllReservations = async (req: Request, res: Response): Promise<void> => {
    try {
        const reservations = await Reservation
            .find({ })
            .sort({ date: 1 })
            .populate("equipment")
            .populate("user", "email");
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

export const changeReservationStatus = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { status } = req.body;
    if (!["pending", "accepted", "rejected", "ready"].includes(status)) {
        res.status(400).json({ error: "invalid status field" });
        return;
    }

    try {
        const reservation = await Reservation.findByIdAndUpdate(id, { status });
        res.status(200).json(reservation);
    }
    catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
}
