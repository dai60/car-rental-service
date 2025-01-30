import { areIntervalsOverlapping, isBefore, isSameDay, isWithinInterval } from "date-fns";
import { Request, Response } from "express";
import Reservation from "../models/Reservation";
import { FormError } from "../utilities";

async function validateDate(start: Date, end: Date | undefined, user: string, equipment: string, exclude?: string) {
    if (end && isBefore(end, start)) {
        throw new FormError("reservation end can't be before start");
    }

    const now = new Date();
    if (isBefore(start, now)) {
        throw new FormError("reservation start can't be in the past");
    }

    const existing = await Reservation.find({ user, equipment }).select({ date: 1 });
    for (const reservation of existing) {
        if (reservation._id.equals(exclude)) {
            continue;
        }

        if (!reservation.date) {
            throw new Error("internal server error");
        }

        if (reservation.date.end && end) {
            if (areIntervalsOverlapping({ start, end }, { start: reservation.date.start, end: reservation.date.end })) {
                throw new FormError("date already reserved");
            }
        }
        else {
            if (reservation.date.end && isWithinInterval(start, { start: reservation.date.start, end: reservation.date.end })) {
                throw new FormError("date already reserved");
            }
            else if (end && isWithinInterval(reservation.date.start, { start, end })) {
                throw new FormError("date already reserved");
            }
            else if (isSameDay(start, reservation.date.start)) {
                throw new FormError("date already reserved");
            }
        }
    }
}

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
        res.sendStatus(500);
    }
}

export const createReservation = async (req: Request, res: Response): Promise<void> => {
    const user = req.user?.id;
    if (!user) {
        res.sendStatus(500);
        return;
    }

    const { equipment, date } = req.body;
    try {
        await validateDate(
            new Date(date.start),
            date.end ? new Date(date.end) : undefined,
            user.toString(),
            equipment
        );
        const reservation = await Reservation.create({ user, equipment, date });
        res.status(200).json(reservation);
    }
    catch (err) {
        if (err instanceof FormError) {
            res.status(400).send({ error: err.message });
        }
        else {
            res.sendStatus(500);
        }
    }
}

export const changeReservationDate = async (req: Request, res: Response): Promise<void> => {
    const user = req.user?.id;
    if (!user) {
        res.sendStatus(500);
        return;
    }

    const id = req.params.id;
    const { start, end } = req.body;
    try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            res.sendStatus(404);
        }
        else if (!reservation.user._id.equals(req.user?.id)) {
            res.sendStatus(401);
        }
        else {
            await validateDate(
                new Date(start),
                end ? new Date(end) : undefined,
                user.toString(),
                reservation.equipment._id.toString(),
                reservation._id.toString(),
            );

            const updated = await Reservation.findByIdAndUpdate(id, { date: { start, end } });
            res.status(200).json(updated);
        }
    }
    catch (err) {
        if (err instanceof FormError) {
            res.status(400).json({ error: err.message });
        }
        else {
            res.sendStatus(500);
        }
    }
}

export const changeReservationStatus = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { status } = req.body;
    try {
        if (!["pending", "accepted", "rejected", "ready"].includes(status)) {
            throw new FormError("invalid status field");
        }

        const reservation = await Reservation.findByIdAndUpdate(id, { status });
        if (!reservation) {
            res.sendStatus(404);
        }
        else {
            res.status(200).json(reservation);
        }
    }
    catch (err) {
        if (err instanceof FormError) {
            res.status(400).json({ error: err.message });
        }
        else {
            res.sendStatus(500);
        }
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
