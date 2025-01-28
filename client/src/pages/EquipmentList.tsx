import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Placeholder from "../public/240x120.svg";
import EquipmentForm from "../components/EquipmentForm";

export type EquipmentData = {
    _id: string;
    name: string;
    description?: string;
    price: number;
    visibility: "draft" | "public";
    createdAt: string,
    updatedAt: string,
}

export const equipmentListLoader = (token?: string) => {
    return async (): Promise<EquipmentData[]> => {
        const res = await fetch("/api/equipment", {
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

const EquipmentList = () => {
    const data = useLoaderData<EquipmentData[]>();
    const [formError, setFormError] = useState<string | undefined>(undefined);
    const { user } = useAuth();
    const revalidator = useRevalidator();

    const addNewEquipment = async (name?: string, description?: string, price?: number, visibility?: string) => {
        setFormError(undefined);
        const res = await fetch("/api/equipment", {
            method: "POST",
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

    return (
        <div className="mx-auto w-full px-8">
            {data.map(equipment => (
                <Link to={`/equipment/${equipment._id}`} key={equipment._id} className="flex border-2 border-zinc-50 rounded-md mb-4 hover:scale-105 cursor-pointer transition-transform">
                    <img className="min-h-full w-[240] object-cover" src={Placeholder} alt={equipment.name} />
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">{equipment.name}</h2>
                        {equipment.description ?
                            (<p className="text-sm mb-1">{equipment.description}</p>) :
                            (<p className="text-sm text-zinc-400 mb-1">No description provided.</p>)
                        }
                        <p className="text-lg font-semibold mb-1">${equipment.price.toFixed(2)}</p>
                        <p className="text-sm text-zinc-400 mb-1">Last updated: {formatDistanceToNow(equipment.updatedAt, { addSuffix: true })}</p>
                    </div>
                </Link>
            ))}
            {user?.admin && (
                <EquipmentForm buttonText="Save" handleSubmit={addNewEquipment} error={formError}/>
            )}
        </div>
    );
}

export default EquipmentList;
