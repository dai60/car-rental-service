import { useState } from "react";
import Button from "./Button";
import Calendar from "./Calendar";
import { addMonths, format } from "date-fns";

type ReservationFormProps = {
    buttonText: string;
    error?: string;
    handleSubmit: (date?: string) => Promise<void>;
    handleCancel?: () => Promise<void>;
}

const ReservationForm = ({ buttonText, error, handleSubmit, handleCancel }: ReservationFormProps) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const minDate = new Date();
    const maxDate = addMonths(minDate, 6);

    return (
        <form
            onSubmit={async e => {
                setIsSubmitting(true);
                e.preventDefault();
                await handleSubmit(date ? format(date, "yyyy-MM-dd") : undefined);
                setIsSubmitting(false);
            }}>
            <p className="block text-sm mb-1">Reservation date:</p>
            <Calendar
                className="w-fit h-fit mb-1"
                min={minDate}
                max={maxDate}
                onSelect={setDate} />
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
