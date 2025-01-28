import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import User from "../models/User";

if (!process.env.SECRET) {
    console.error("SECRET not found in .env");
    process.exit(1);
}

const createUserToken = (id: Types.ObjectId): string => {
    const token = jwt.sign({ id }, process.env.SECRET!, { expiresIn: "1h" });
    return token;
}

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email) {
        res.status(400).json({ error: "missing email" });
        return;
    }

    if (!password) {
        res.status(400).json({ error: "missing password" });
        return;
    }

    const exists = await User.exists({ email });
    if (exists) {
        res.status(400).json({ error: "user already exists" });
        return;
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, password: hash });
    const token = createUserToken(user._id);

    res.status(200).json({ email, admin: user.admin, token });
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email) {
        res.status(400).json({ error: "missing email" });
        return;
    }

    if (!password) {
        res.status(400).json({ error: "missing password" });
        return;
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).json({ error: "user does not exist" });
        return;
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
        res.status(400).json({ error: "invalid password" });
        return;
    }

    const token = createUserToken(user._id);
    res.status(200).json({ email, admin: user.admin, token });
}
