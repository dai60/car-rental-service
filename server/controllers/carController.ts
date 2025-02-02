import { Request, Response } from "express";
import "multer";
import Car from "../models/Car";
import Reservation from "../models/Reservation";
import { FormError } from "../utilities";

type CarFormData = {
    model: string;
    description?: string;
    price: number;
    imageUrl?: string;
    visibility: "draft" | "public";
}

function validateCarData(body: any, file?: Express.Multer.File): CarFormData {
    const { model, description, price, visibility } = JSON.parse(body.json);

    if (!model) {
        throw new FormError("missing model");
    }
    if (typeof model !== "string") {
        throw new FormError("model must be a string");
    }
    if (description && typeof description !== "string") {
        throw new FormError("description must be a string");
    }
    if (!price) {
        throw new FormError("missing price");
    }
    if (typeof price !== "number") {
        throw new FormError("price must be a number");
    }
    if (price < 0) {
        throw new FormError("price can't be negative");
    }
    if (visibility && visibility !== "draft" && visibility !== "public") {
        throw new FormError("visibility must be 'draft' or 'public'");
    }

    return {
        model,
        description,
        price,
        imageUrl: file?.path,
        visibility,
    };
}

export const getCar = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const car = await Car.findById(id);
        if (!car) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(car);
    }
    catch (err) {
        res.sendStatus(500);
    }
}

export const getAllCars = async (req: Request, res: Response): Promise<void> => {
    const query = req.user?.admin ? {} : { visibility: "public" };
    try {
        const car = await Car.find(query).sort({ updatedAt: -1 });
        res.status(200).json(car);
    }
    catch (err) {
        res.sendStatus(500);
    }
}

export const addNewCar = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = validateCarData(req.body, req.file);
        const car = await Car.create(data);
        res.status(200).json(car);
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

export const updateCar = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
     try {
        const data = validateCarData(req.body, req.file);
        const car = await Car.findByIdAndUpdate(id, data);
        if (!car) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(car);
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

export const deleteCar = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
        res.sendStatus(500);
        return;
    }

    try {
        const car = await Car.findByIdAndDelete(id);
        if (!car) {
            res.sendStatus(404);
            return;
        }

        await Reservation.deleteMany({ car: car._id });
        res.status(200).json(car);
    }
    catch (err) {
        res.sendStatus(500);
    }
}
