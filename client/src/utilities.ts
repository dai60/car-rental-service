type Timestamps = {
    createdAt: string;
    updatedAt: string;
}

export type ClassName = {
    className?: string;
}

export type UserData = {
    _id: string;
    email: string;
}

export type EquipmentData = {
    _id: string;
    name: string;
    description?: string;
    price: number;
    visibility: "draft" | "public";
} & Timestamps;

export type ReservationStatus = "pending" | "accepted" | "rejected" | "ready";

export type ReservationData = {
    _id: string;
    date: {
        start: string;
        end?: string;
    }
    status: ReservationStatus;
    user: string | UserData;
    equipment: string | EquipmentData;
} & Timestamps;

export function delay(timeout: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
