import { useState } from "react";
import { Link, LoaderFunctionArgs, useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import { useAuth } from "../context/Auth";
import ReservationForm from "../components/ReservationForm";
import Car from "../components/Car";
import CarForm from "../components/CarForm";
import { CarData, ReservationData } from "../utilities";
import Section from "../components/Section";
import Reservation from "../components/Reservation";

export const carDetailsLoader = (token?: string) => {
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
            fetchData(`/api/cars/${params.id}`),
            fetchData(`/api/reservation/for/${params.id}`),
        ]);
    }
}

const CarDetails = () => {
    const [car, reservations] = useLoaderData<[CarData, ReservationData[]]>();
    const [formError, setFormError] = useState<string | undefined>(undefined);
    const { user } = useAuth();
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const updateCar = async (model?: string, description?: string, price?: number, image?: File, visibility?: string) => {
        setFormError(undefined);

        const formData = new FormData();
        if (image) {
            formData.append("image", image);
        }
        formData.append("json", JSON.stringify({ model, description, price, visibility }));

        const res = await fetch(`/api/cars/${car._id}`, {
            method: "PUT",
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

    const deleteCar = async () => {
        const res = await fetch(`/api/cars/${car._id}`, {
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
            navigate("/cars");
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
                car: car._id,
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
                title="Car Details"
                element={<Car className="mb-4" modal {...car} />} />
            {user?.admin && (
                <Section
                    title="Edit Details"
                    element={<CarForm
                        defaultValues={car}
                        handleSubmit={updateCar}
                        handleDelete={deleteCar}
                        error={formError} />} />
            )}
            <Section
                title="Reservations"
                element={reservations.length === 0 ? (
                    <p className="text-secondary text-center">No reservations.</p>
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
                    element={<ReservationForm
                        price={car.price}
                        buttonText="Reserve"
                        error={formError}
                        handleSubmit={createReservation} />} />
            )}
        </div>
    );
}

export default CarDetails;
