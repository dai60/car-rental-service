import { useState } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { useAuth } from "../context/Auth";
import EquipmentForm from "../components/EquipmentForm";
import Equipment from "../components/Equipment";
import { EquipmentData } from "../utilities";
import Section from "../components/Section";

export const equipmentListLoader = (token?: string) => {
    return async () => {
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
            <Section title="All Equipment" element={(
                <div>
                    {data.map(equipment => (
                        <Link key={equipment._id} to={`/equipment/${equipment._id}`}>
                            <Equipment className="mb-4 cursor-pointer hover:scale-105 transition-transform" {...equipment} />
                        </Link>
                    ))}
                </div>
            )} />
            {user?.admin && (
                <Section
                    title="Add New Equipment"
                    element={<EquipmentForm handleSubmit={addNewEquipment} error={formError}/>} />
            )}
        </div>
    );
}

export default EquipmentList;
