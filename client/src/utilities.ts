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

export type CarData = {
    _id: string;
    model: string;
    description?: string;
    price: number;
    imageUrl?: string;
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
    car: string | CarData;
} & Timestamps;

export function delay(timeout: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
