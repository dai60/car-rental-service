import { useState } from "react";
import Button from "./Button";
import Calendar from "./Calendar";
import { format } from "date-fns";

type ReservationFormProps = {
    handleSubmit: (date?: string) => Promise<void>;
}

const ReservationForm = ({ handleSubmit }: ReservationFormProps) => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
        <form
            className="border-zinc-50 border-2 rounded-md p-4"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(date ? format(date, "yyyy-MM-dd") : undefined);
            }}>
            <p className="block text-sm mb-1">Reservation date:</p>
            <Calendar className="w-fit h-fit mb-2" onSelect={setDate} />
            <Button className="bg-yellow-600">Reserve</Button>
        </form>
    );
}

export default ReservationForm;
