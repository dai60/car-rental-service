import { Link, useLoaderData } from "react-router-dom";
import { ReservationData } from "../utilities";
import Reservation from "../components/Reservation";
import Section from "../components/Section";
import { useId, useState } from "react";

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
    const filterId = useId();

    const [filter, setFilter] = useState("all");

    const filtered = filter === "all" ? data : data.filter(x => x.status === filter);

    return (
        <div className="mx-auto w-full px-8">
            <Section
                title="Reservations"
                element={(
                    <div>
                    <label className="me-2 mb-1 block sm:inline" htmlFor={filterId}>Filter:</label>
                    <select id={filterId} className="bg-background-secondary px-2 py-1 mb-4 w-full sm:w-fit" onChange={e => setFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="ready">Ready</option>
                    </select>
                    {filtered.length == 0 ? (
                        <p className="text-secondary text-center">There are no reservations.</p>
                    ) : (
                        <>
                            {filtered.map(reservation => (
                                <Link key={reservation._id} to={`/reservations/${reservation._id}`}>
                                    <Reservation className="mb-4 hover:scale-105 transition-transform" {...reservation} />
                                </Link>
                            ))}
                        </>
                    )}
                    </div>
                )} />
        </div>
    );
}

export default ReservationList;
