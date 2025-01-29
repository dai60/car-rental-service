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

export type ReservationData = {
    _id: string;
    date: string;
    status: "pending" | "accepted" | "rejected" | "ready";
    user: string | UserData;
    equipment: string | EquipmentData;
} & Timestamps;
