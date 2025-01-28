import { useState } from "react";
import { LoaderFunctionArgs, useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import { useAuth } from "../context/Auth";
import EquipmentForm from "../components/EquipmentForm";
import ReservationForm from "../components/ReservationForm";
import Equipment from "../components/Equipment";
import { EquipmentData } from "../utilities";

export const equipmentDetailsLoader = (token?: string) => {
    return async ({ params }: LoaderFunctionArgs) => {
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
            <Equipment className="mb-4" {...data} />
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
