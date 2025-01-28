import { useEffect, useState } from "react";
import { LoaderFunctionArgs, useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import { EquipmentData } from "./EquipmentList";
import Placeholder from "../public/240x120.svg";
import { useAuth } from "../context/Auth";
import EquipmentForm from "../components/EquipmentForm";
import ReservationForm from "../components/ReservationForm";

export const equipmentDetailsLoader = (token?: string) => {
    return async ({ params }: LoaderFunctionArgs): Promise<EquipmentData> => {
        const res = await fetch(`/api/equipment/${params.id}`, {
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

const EquipmentDetails = () => {
    const data = useLoaderData<EquipmentData>();
    const [formError, setFormError] = useState<string | undefined>(undefined);
    const { user } = useAuth();
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const updateEquipment = async (name?: string, description?: string, price?: number, visibility?: string) => {
        setFormError(undefined);
        const res = await fetch(`/api/equipment/${data._id}`, {
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
        const res = await fetch(`/api/equipment/${data._id}`, {
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

    const createReservation = async (date?: string) => {
        const res = await fetch(`/api/reservation`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${user?.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                equipment: data._id,
                date,
            }),
        });

        const json = await res.json();
        if (!res.ok) {
            console.error(json.error);
        }
        else {
            navigate("/reservations");
        }
    }

    return (
        <div className="mx-auto w-full px-8">
            <div className="flex border-2 border-zinc-50 rounded-md mb-4">
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{data.name}</h2>
                    {data.description ?
                        (<p className="text-sm mb-1">{data.description}</p>) :
                        (<p className="text-sm text-zinc-400 mb-1">No description provided.</p>)
                    }
                    <p className="text-lg font-semibold">${data.price.toFixed(2)}</p>
                </div>
                <img className="ml-auto" src={Placeholder} alt={data.name} />
            </div>
            {user?.admin ? (
                <>
                    <button
                        className="bg-red-600 w-32 py-1 text-lg rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={deleteEquipment}>
                            Delete
                    </button>
                    <EquipmentForm defaultValues={data} buttonText="Edit" handleSubmit={updateEquipment} error={formError} />
                </>
            ) : (
                <>
                    <ReservationForm handleSubmit={createReservation} />
                </>
            )}
        </div>
    );
}

export default EquipmentDetails;
