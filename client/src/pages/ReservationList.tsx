import { Link, useLoaderData } from "react-router-dom";
import { ReservationData } from "../utilities";
import Reservation from "../components/Reservation";
import Section from "../components/Section";

export const reservationListLoader = (token?: string, admin?: boolean) => {
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

const ReservationList = () => {
    const data = useLoaderData<ReservationData[]>();

    return (
        <div className="mx-auto w-full px-8">
            <Section
                title="Reservations"
                element={data.length == 0 ? (
                    <p className="text-secondary text-center">There are no reservations.</p>
                ) : (
                    <div>
                        {data.map(reservation => (
                            <Link key={reservation._id} to={`/reservations/${reservation._id}`}>
                                <Reservation className="mb-4 hover:scale-105 transition-transform" {...reservation} />
                            </Link>
                        ))}
                    </div>
                )}/>
        </div>
    );
}

export default ReservationList;
