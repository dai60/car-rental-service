import { Types } from "mongoose";

export interface JwtPayload {
    id: Types.ObjectId;
}

declare module "express" {
    interface Request {
        user?: {
            id: Types.ObjectId;
            admin: boolean;
        };
    }
}
