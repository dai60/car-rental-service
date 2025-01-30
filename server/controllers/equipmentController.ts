import { Request, Response } from "express";
import Equipment from "../models/Equipment";
import Reservation from "../models/Reservation";
import { FormError } from "../utilities";

type EquipmentFormData = {
    name: string;
    description?: string;
    price: number;
    visibility: "draft" | "public";
}

function validateEquipmentData(body: any): EquipmentFormData {
    const { name, description, price, visibility } = body;

    if (!name) {
        throw new FormError("missing name");
    }
    if (typeof name !== "string") {
        throw new FormError("name must be a string");
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

    return { name, description, price, visibility };
}

export const getEquipment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const equipment = await Equipment.findById(id);
        if (!equipment) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(equipment);
    }
    catch (err) {
        res.sendStatus(500);
    }
}

export const getAllEquipment = async (req: Request, res: Response): Promise<void> => {
    const query = req.user?.admin ? {} : { visibility: "public" };
    try {
        const equipment = await Equipment.find(query).sort({ updatedAt: -1 });
        res.status(200).json(equipment);
    }
    catch (err) {
        res.sendStatus(500);
    }
}

export const addNewEquipment = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = validateEquipmentData(req.body);
        const equipment = await Equipment.create(data);
        res.status(200).json(equipment);
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

export const updateEquipment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
     try {
        const data = validateEquipmentData(req.body);
        const equipment = await Equipment.findByIdAndUpdate(id, data);
        if (!equipment) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(equipment);
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

export const deleteEquipment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
        res.sendStatus(500);
        return;
    }

    try {
        const equipment = await Equipment.findByIdAndDelete(id);
        if (!equipment) {
            res.sendStatus(404);
            return;
        }

        await Reservation.deleteMany({ equipment: equipment._id });
        res.status(200).json(equipment);
    }
    catch (err) {
        res.sendStatus(500);
    }
}
