import { useState } from "react";
import Button from "./Button";
import Calendar from "./Calendar";
import { format } from "date-fns";

type ReservationFormProps = {
    buttonText: string;
    handleSubmit: (date?: string) => Promise<void>;
    handleCancel?: () => void;
}

const ReservationForm = ({ buttonText, handleSubmit, handleCancel }: ReservationFormProps) => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
        <form
            className="border-zinc-50 border-2 rounded-md p-4"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(date ? format(date, "yyyy-MM-dd") : undefined);
            }}>
            <p className="block text-sm mb-1">Reservation date:</p>
            <Calendar className="w-fit h-fit mb-4" onSelect={setDate} />
            <Button submit={true} className="bg-yellow-600 me-2">{buttonText}</Button>
            {handleCancel && <Button onClick={handleCancel} className="bg-red-600">Cancel</Button>}
        </form>
    );
}

export default ReservationForm;
