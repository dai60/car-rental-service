import { useState } from "react";
import Button from "./Button";
import Calendar from "./Calendar";
import { format } from "date-fns";
import { delay } from "../utilities";

type ReservationFormProps = {
    buttonText: string;
    error?: string;
    handleSubmit: (date?: string) => Promise<void>;
    handleCancel?: () => Promise<void>;
}

const ReservationForm = ({ buttonText, error, handleSubmit, handleCancel }: ReservationFormProps) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <form
            className="border-zinc-50 border-2 rounded-md p-4"
            onSubmit={async e => {
                setIsSubmitting(true);
                e.preventDefault();
                await delay(2000);
                await handleSubmit(date ? format(date, "yyyy-MM-dd") : undefined);
                setIsSubmitting(false);
            }}>
            <p className="block text-sm mb-1">Reservation date:</p>
            <Calendar className="w-fit h-fit mb-1" onSelect={setDate} />
            {error && <p className="text-red-600 font-semibold">{error}</p>}
            <div className="mt-4">
                <Button submit={true} disabled={isSubmitting} className="bg-yellow-600 me-2">{buttonText}</Button>
                {handleCancel && <Button disabled={isSubmitting} onClick={async () => {
                    setIsSubmitting(true);
                    await handleCancel();
                    setIsSubmitting(false);
                }} className="bg-red-600">Cancel</Button>}
            </div>
        </form>
    );
}

export default ReservationForm;
