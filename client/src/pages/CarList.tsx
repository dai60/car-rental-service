import { useState } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Car from "../components/Car";
import CarForm from "../components/CarForm";
import { CarData } from "../utilities";
import Section from "../components/Section";

export const carListLoader = (token?: string) => {
    return async () => {
        const res = await fetch("/api/cars", {
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

const CarList = () => {
    const data = useLoaderData<CarData[]>();
    const [formError, setFormError] = useState<string | undefined>(undefined);
    const { user } = useAuth();
    const revalidator = useRevalidator();

    const addNewCar = async (name?: string, description?: string, price?: number, visibility?: string) => {
        setFormError(undefined);
        const res = await fetch("/api/cars", {
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
            <Section title="All Cars" element={(
                <div>
                    {data.map(car => (
                        <Link key={car._id} to={`/cars/${car._id}`}>
                            <Car className="mb-4 cursor-pointer hover:scale-105 transition-transform" {...car} />
                        </Link>
                    ))}
                </div>
            )} />
            {user?.admin && (
                <Section
                    title="Add New Car"
                    element={<CarForm handleSubmit={addNewCar} error={formError}/>} />
            )}
        </div>
    );
}

export default CarList;
