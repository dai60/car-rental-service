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
        res.sendStatus(500);
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
        res.sendStatus(500);
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
        res.sendStatus(500);
    }
}

export const getReservationsFor = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.sendStatus(500);
        return;
    }

    const id = req.params.id;
    const query = req.user.admin ?
        { equipment: id } : { user: req.user.id, equipment: id };

    try {
        const reservations = await Reservation
            .find(query)
            .sort({ date: 1 })
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
        res.sendStatus(500);
    }
}

export const changeReservationDate = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { date } = req.body;

    try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            res.sendStatus(404);
        }
        else if (!reservation.user._id.equals(req.user?.id)) {
            res.sendStatus(401);
        }
        else {
            const updated = await Reservation.findByIdAndUpdate(id, { date });
            res.status(200).json(reservation);
        }
    }
    catch (err) {
        res.sendStatus(500);
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
        if (!reservation) {
            res.sendStatus(404);
        }
        else {
            res.status(200).json(reservation);
        }
    }
    catch (err) {
        res.sendStatus(500);
    }
}

export const cancelReservation = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            res.status(404).json({ error: "not found" });
            return;
        }

        if (!reservation.user._id.equals(req.user?.id)) {
            res.status(401).json({ error: "unauthorized access" });
            return;
        }

        const deleted = await Reservation.findByIdAndDelete(id);
        res.status(200).json(deleted);
    }
    catch (err) {
        res.sendStatus(500);
    }
}
