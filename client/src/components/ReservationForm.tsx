import { addMonths, eachDayOfInterval, format } from "date-fns";
import { useState } from "react";
import Button from "./Button";
import Calendar, { CalendarDateState } from "./Calendar";

type ReservationFormProps = {
    price: number;
    buttonText: string;
    error?: string;
    defaultValue?: CalendarDateState
    handleSubmit: (start?: string, end?: string) => Promise<void>;
    handleCancel?: () => Promise<void>;
}

const ReservationForm = ({ price, buttonText, error, defaultValue, handleSubmit, handleCancel }: ReservationFormProps) => {
    const [date, setDate] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const minDate = new Date();
    const maxDate = addMonths(minDate, 6);

    const totalPrice = !date[0] ? 0 :
        (!date[1] ? price : price * eachDayOfInterval({ start: date[0], end: date[1] }).length);

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
                className="w-fit h-fit mb-2"
                min={minDate}
                max={maxDate}
                defautValue={defaultValue}
                onSelect={setDate} />
            <p className="text-sm">Total Price: <span className="text-xl font-semibold">${totalPrice.toFixed(2)}</span></p>
            {error && <p className="text-error font-semibold">{error}</p>}
            <div className="mt-4">
                <Button submit={true} disabled={isSubmitting} className="bg-accent me-2">{buttonText}</Button>
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
