import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";
import User from "../models/User";

if (!process.env.SECRET) {
    console.error("SECRET not found in .env");
    process.exit(1);
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        res.status(403).json({ error: "missing authorization token" });
        return;
    }

    const substr = auth.substring(7);
    jwt.verify(substr, process.env.SECRET!, async (err, token) => {
        if (err) {
            res.status(401).json({ error: "invalid authorization token" });
            return;
        }

        const { id } = token as JwtPayload;
        if (!id) {
            res.status(401).json({ error: "invalid authorization token" });
            return;
        }

        const user = await User.findById(id);
        if (!user) {
            res.status(401).json({ error: "invalid authorization token" });
            return;
        }

        req.user = { id, admin: user.admin };
        next();
    });
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        throw new Error("isAdmin must be called after authMiddleware");
    }

    if (!req.user.admin) {
        res.status(401).json({ error: "unauthorized access" });
        return;
    }

    next();
}
