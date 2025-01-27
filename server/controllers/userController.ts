import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";

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
    res.status(200).json(user);
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

    res.status(200).json(user);
}
