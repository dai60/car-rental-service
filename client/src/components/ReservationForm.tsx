import { addMonths, format } from "date-fns";
import { useState } from "react";
import Button from "./Button";
import Calendar, { CalendarDateState } from "./Calendar";

type ReservationFormProps = {
    buttonText: string;
    error?: string;
    defaultValue?: CalendarDateState
    handleSubmit: (start?: string, end?: string) => Promise<void>;
    handleCancel?: () => Promise<void>;
}

const ReservationForm = ({ buttonText, error, defaultValue, handleSubmit, handleCancel }: ReservationFormProps) => {
    const [date, setDate] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const minDate = new Date();
    const maxDate = addMonths(minDate, 6);

    return (
        <form
            onSubmit={async e => {
                setIsSubmitting(true);
                e.preventDefault();
                await handleSubmit(
                    date[0] ? format(date[0], "yyyy-MM-dd") : undefined,
                    date[1] ? format(date[1], "yyyy-MM-dd") : undefined);
                setIsSubmitting(false);
            }}>
            <p className="block text-sm mb-1">Reservation date:</p>
            <Calendar
                className="w-fit h-fit mb-1"
                min={minDate}
                max={maxDate}
                defautValue={defaultValue}
                onSelect={setDate} />
            <p className="text-sm">From: {date[0] ? format(date[0], "yyyy-MM-dd") : "YYYY-MM-DD"}</p>
            <p className="text-sm mb-1">To: {date[1] ? format(date[1], "yyyy-MM-dd") : "YYYY-MM-DD"}</p>
            {error && <p className="text-error font-semibold">{error}</p>}
            <div className="mt-4">
                <Button submit={true} disabled={isSubmitting} className="bg-yellow-600 me-2">{buttonText}</Button>
                {handleCancel && <Button disabled={isSubmitting} onClick={async () => {
                    setIsSubmitting(true);
                    await handleCancel();
                    setIsSubmitting(false);
                }} className="bg-error">Cancel</Button>}
            </div>
        </form>
    );
}

export default ReservationForm;
