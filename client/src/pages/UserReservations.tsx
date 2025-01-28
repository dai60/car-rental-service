import { useLoaderData } from "react-router-dom";
import { ReservationData } from "../utilities";
import Equipment from "../components/Equipment";

export const userReservationsLoader = (token?: string) => {
    return async () => {
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
                <>
                    {typeof reservation.equipment === "object" &&
                        <Equipment className="mb-4" {...reservation.equipment} />}
                </>
            ))}
        </div>
    );
}

export default UserReservations;
