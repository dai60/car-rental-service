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
    const { user } = useAuth();
    const revalidator = useRevalidator();

    const [sort, setSort] = useState<string | undefined>(undefined);
    const [formError, setFormError] = useState<string | undefined>(undefined);

    switch (sort) {
        case "created":
            data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        case "updated":
            data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            break;
        case "price":
            data.sort((a, b) => a.price - b.price);
            break;
        case "priceDesc":
            data.sort((a, b) => b.price - a.price);
            break;
    }

    const addNewCar = async (model?: string, description?: string, price?: number, image?: File, visibility?: string) => {
        setFormError(undefined);

        const formData = new FormData();
        if (image) {
            formData.append("image", image);
        }
        formData.append("json", JSON.stringify({ model, description, price, visibility }));

        const res = await fetch("/api/cars", {
            method: "POST",
            headers: { "Authorization": `Bearer ${user?.token}` },
            body: formData,
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
                    <label className="me-2" htmlFor="">Sort by:</label>
                    <select className="bg-background-secondary px-2 py-1 mb-4" onChange={e => setSort(e.target.value)}>
                        <option value="updated">Last Updated</option>
                        <option value="created">Created</option>
                        <option value="price">Price</option>
                        <option value="priceDesc">Price (Descending)</option>
                    </select>
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
