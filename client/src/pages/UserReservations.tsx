import { Link, useLoaderData } from "react-router-dom";
import { ReservationData } from "../utilities";
import Reservation from "../components/Reservation";

export const userReservationsLoader = (token?: string, admin?: boolean) => {
    return async () => {
        const res = await fetch(`/api/reservation/${admin ? "admin" : "user"}`, {
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

    if (data.length === 0) {
        return <p className="text-zinc-400 mx-auto my-8 text-center">There are no reservations.</p>
    }

    return (
        <div className="mx-auto w-full px-8">
            {data.map(reservation => (
                <Link to={`/reservations/${reservation._id}`}>
                    <Reservation key={reservation._id} className="mb-4 hover:scale-[102%] transition-transform" {...reservation} />
                </Link>
            ))}
        </div>
    );
}

export default UserReservations;
