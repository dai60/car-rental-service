import { useState } from "react";
import { Link, LoaderFunctionArgs, useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import { useAuth } from "../context/Auth";
import EquipmentForm from "../components/EquipmentForm";
import ReservationForm from "../components/ReservationForm";
import Equipment from "../components/Equipment";
import { EquipmentData, ReservationData } from "../utilities";
import Section from "../components/Section";
import Reservation from "../components/Reservation";

export const equipmentDetailsLoader = (token?: string) => {
    const fetchData = async (url: string) => {
        const res = await fetch(url, {
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

    return async ({ params }: LoaderFunctionArgs) => {
        return Promise.all([
            fetchData(`/api/equipment/${params.id}`),
            fetchData(`/api/reservation/for/${params.id}`),
        ]);
    }
}

const EquipmentDetails = () => {
    const [equipment, reservations] = useLoaderData<[EquipmentData, ReservationData[]]>();
    const [formError, setFormError] = useState<string | undefined>(undefined);
    const { user } = useAuth();
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const updateEquipment = async (name?: string, description?: string, price?: number, visibility?: string) => {
        setFormError(undefined);
        const res = await fetch(`/api/equipment/${equipment._id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${user?.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description, price, visibility })
        });

        const json = await res.json();
        if (!res.ok) {
            setFormError(json.error);
        }
        else {
            revalidator.revalidate();
        }
    }

    const deleteEquipment = async () => {
        const res = await fetch(`/api/equipment/${equipment._id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user?.token}`,
            },
        });

        const json = await res.json();
        if (!res.ok) {
            console.error(json.error);
        }
        else {
            navigate("/equipment");
        }
    }

    const createReservation = async (start?: string, end?: string) => {
        setFormError(undefined);
        const res = await fetch(`/api/reservation`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${user?.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                equipment: equipment._id,
                date: { start, end },
            }),
        });

        const json = await res.json();
        if (!res.ok) {
            setFormError(json.error);
        }
        else {
            navigate(`/reservations/${json._id}`);
        }
    }

    return (
        <div className="mx-auto w-full px-8">
            <Section
                title="Equipment Details"
                element={<Equipment className="mb-4" {...equipment} />} />
            {user?.admin && (
                <Section
                    title="Edit Details"
                    element={<EquipmentForm
                        defaultValues={equipment}
                        handleSubmit={updateEquipment}
                        handleDelete={deleteEquipment}
                        error={formError} />} />
            )}
            <Section
                title="Reservations"
                element={reservations.length === 0 ? (
                    <p className="text-zinc-400 text-center">No reservations.</p>
                ) : (
                    <>
                        {reservations.map(reservation => (
                            <Link key={reservation._id} to={`/reservations/${reservation._id}`} >
                                <Reservation className="mb-4 hover:scale-105 transition-transform" {...reservation} />
                            </Link>
                        ))}
                    </>
                )}/>
            {user && !user.admin && (
                <Section
                    title="Create Reservation"
                    element={<ReservationForm buttonText="Reserve" error={formError} handleSubmit={createReservation} />} />
            )}
        </div>
    );
}

export default EquipmentDetails;
