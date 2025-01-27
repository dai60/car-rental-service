import { Request, Response } from "express";
import Equipment from "../models/Equipment";

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
    if (visibility && visibility !== "draft" && visibility !== "public") {
        throw new Error("visibility must be 'draft' or 'public'");
    }

    return { name, description, price, visibility };
}

export const getEquipment = async (req: Request, res: Response): Promise<void> => {
    const equipment = await Equipment.find({});
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

export const deleteEquipment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
        res.status(500).json({ error: "internal server error" });
        return;
    }

    await Equipment.findByIdAndDelete(id);
    res.status(200).json({});
}
