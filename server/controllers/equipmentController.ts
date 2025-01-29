import { Request, Response } from "express";
import Equipment from "../models/Equipment";
import Reservation from "../models/Reservation";

type EquipmentFormData = {
    name: string;
    description?: string;
    price: number;
    visibility: "draft" | "public";
}

function validateEquipmentData(body: any): EquipmentFormData {
    const { name, description, price, visibility } = body;

    if (!name) {
        throw new Error("missing name");
    }
    if (typeof name !== "string") {
        throw new Error("name must be a string");
    }
    if (description && typeof description !== "string") {
        throw new Error("description must be a string");
    }
    if (!price) {
        throw new Error("missing price");
    }
    if (typeof price !== "number") {
        throw new Error("price must be a number");
    }
    if (price < 0) {
        throw new Error("price can't be negative");
    }
    if (visibility && visibility !== "draft" && visibility !== "public") {
        throw new Error("visibility must be 'draft' or 'public'");
    }

    return { name, description, price, visibility };
}

export const getEquipment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const equipment = await Equipment.findById(id);
        if (!equipment) {
            throw new Error("not found");
        }

        res.status(200).json(equipment);
    }
    catch (err) {
        res.status(404).json({ error: "not found" });
    }
}

export const getAllEquipment = async (req: Request, res: Response): Promise<void> => {
    const query = req.user?.admin ? {} : { visibility: "public" };
    const equipment = await Equipment.find(query).sort({ updatedAt: -1 });
    res.status(200).json(equipment);
}

export const addNewEquipment = async (req: Request, res: Response): Promise<void> => {
    let data: EquipmentFormData;
    try {
        data = validateEquipmentData(req.body);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
        return;
    }

    const equipment = await Equipment.create(data);
    res.status(200).json(equipment);
}

export const updateEquipment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    let data: EquipmentFormData;
    try {
        data = validateEquipmentData(req.body);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
        return;
    }

    try {
        const equipment = await Equipment.findByIdAndUpdate(id, data);
        if (!equipment) {
            throw new Error("not found");
        }
        res.status(200).json(equipment);
    }
    catch (err) {
        res.status(404).json({ error: "not found" });
    }
}

export const deleteEquipment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
        res.status(500).json({ error: "internal server error" });
        return;
    }

    try {
        const equipment = await Equipment.findByIdAndDelete(id);
        if (!equipment) {
            throw new Error("not found");
        }

        await Reservation.deleteMany({ equipment: equipment._id });
        res.status(200).json({});
    }
    catch (err) {
        res.status(404).json({ error: "not found" });
    }
}
