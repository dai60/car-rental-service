import { useLoaderData } from "react-router-dom";

type ReservationData = {
    _id: string;
    date: string;
    equipment: {
        _id: string;
        name: string;
        description?: string;
        price: number;
    },
    createdAt: string;
    updatedAt: string;
}

export const userReservationsLoader = (token?: string) => {
    return async (): Promise<ReservationData[]> => {
        const res = await fetch(`/api/reservation/user`, {
            headers: { "Authorization": `Bearer ${token}` },
        });

        try {
            const json = await res.json();
            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}: ${json.error}`);
            }
            return json;
        }
        catch (err) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
    }
}

const UserReservations = () => {
    const data = useLoaderData<ReservationData[]>();

    return (
        <div className="mx-auto w-full px-8">
            {data.map(reservation => (
                <div key={reservation._id} className="border-2 border-zinc-50 rounded-md mb-4 p-4">
                    <h2 className="text-xl font-bold">{reservation.equipment.name}</h2>
                    <p className="text-sm text-zinc-400">Reserved for {new Date(reservation.date).toISOString().substring(0, 10)}</p>
                </div>
            ))}
        </div>
    );
}

export default UserReservations;
