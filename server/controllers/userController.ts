import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import validator from "validator";
import User from "../models/User";
import { FormError } from "../utilities";

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

    try {
        if (!email) {
            throw new FormError("missing email");
        }
        if (!validator.isEmail(email)) {
            throw new FormError("invalid email");
        }

        if (!password) {
            throw new FormError("missing password");
        }
        if (validator.isStrongPassword(password, { returnScore: true }) < 25) {
            throw new FormError("password too weak");
        }

        const exists = await User.exists({ email });
        if (exists) {
            throw new FormError("user already exists");
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({ email, password: hash });
        const token = createUserToken(user._id);

        res.status(200).json({ _id: user._id, email, admin: user.admin, token });
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

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        if (!email) {
            throw new FormError("missing email");
        }

        if (!password) {
            throw new FormError("missing password");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new FormError("user does not exist");
        }

        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            throw new FormError("invalid password");
        }

        const token = createUserToken(user._id);
        res.status(200).json({ _id: user._id, email, admin: user.admin, token });
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
