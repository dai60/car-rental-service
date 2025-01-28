type Timestamps = {
    createdAt: string;
    updatedAt: string;
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
    equipment: string | EquipmentData;
} & Timestamps;
