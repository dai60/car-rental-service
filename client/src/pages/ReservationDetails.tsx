import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import Reservation from "../components/Reservation";
import { ReservationData } from "../utilities";

export const reservationDetailsLoader = (token?: string) => {
    return async ({ params }: LoaderFunctionArgs) => {
        const res = await fetch(`/api/reservation/${params.id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
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

const ReservationDetails = () => {
    const data = useLoaderData<ReservationData>();

    return (
        <div className="mx-auto w-full px-8">
            <Reservation {...data} />
        </div>
    );
}

export default ReservationDetails;
