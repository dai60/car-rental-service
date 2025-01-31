import { Link, LoaderFunctionArgs, Navigate, useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import Reservation from "../components/Reservation";
import { ReservationData } from "../utilities";
import { useAuth } from "../context/Auth";
import Button from "../components/Button";
import { useRef, useState } from "react";
import Section from "../components/Section";
import Car from "../components/Car";
import ReservationForm from "../components/ReservationForm";

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
    const { user } = useAuth();
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const [formError, setFormError] = useState<string | undefined>(undefined);
    const statusRef = useRef<HTMLSelectElement>(null);

    if (!user) {
        return <Navigate to={"/"} />
    }

    const cancelReservation = async () => {
        const res = await fetch(`/api/reservation/${data._id}`, {
            headers: { "Authorization": `Bearer ${user?.token}` },
            method: "DELETE",
        });
        const json = await res.json();

        if (!res.ok) {
            console.error(json.error);
        }
        else {
            navigate("/reservations");
        }
    }

    const changeDate = async (start?: string, end?: string) => {
        setFormError(undefined);
        const res = await fetch(`/api/reservation/date/${data._id}`, {
            headers: {
                "Authorization": `Bearer ${user?.token}`,
                "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify({ start, end }),
        });
        const json = await res.json();

        if (!res.ok) {
            setFormError(json.error);
        }
        else {
            revalidator.revalidate();
        }
    }

    const changeStatus = async (status?: string) => {
        setFormError(undefined);
        const res = await fetch(`/api/reservation/status/${data._id}`, {
            headers: {
                "Authorization": `Bearer ${user?.token}`,
                "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify({ status }),
        });
        const json = await res.json();

        if (!res.ok) {
            setFormError(json.error);
        }
        else {
            revalidator.revalidate();
        }
    }

    return (
        <div className="mx-auto w-full px-8">
            <Section
                title="Reservation Details"
                element={<Reservation className="mb-4" {...data} />} />

            {data.car && typeof data.car !== "string" &&
                <Section
                    title="Car"
                    element={(
                        <Link to={`/cars/${data.car._id}`}>
                            <Car className="mb-4 hover:scale-105 transition-transform" {...data.car} />
                        </Link>
                    )} />
            }
            <Section
                title="Change Details"
                element={user.admin ? (
                    <form onSubmit={e => {
                        e.preventDefault();
                        changeStatus(statusRef.current?.value);
                    }}>
                        <select name="status" className="bg-background-secondary px-2 py-1 me-2" ref={statusRef} defaultValue={data.status}>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="ready">Ready</option>
                        </select>
                        <Button className="bg-accent">Change Status</Button>
                    </form>
                ) : (
                    <ReservationForm
                        price={typeof data.car !== "string" ? data.car.price : 0}
                        buttonText="Change Date"
                        error={formError}
                        defaultValue={[new Date(data.date.start), data.date.end ? new Date(data.date.end) : undefined]}
                        handleSubmit={changeDate}
                        handleCancel={cancelReservation}/>
                )}/>
        </div>
    );
}

export default ReservationDetails;
