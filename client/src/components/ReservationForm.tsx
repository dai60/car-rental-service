import { useId, useRef } from "react";
import Button from "./Button";

type ReservationFormProps = {
    handleSubmit: (date?: string) => Promise<void>;
}

const ReservationForm = ({ handleSubmit }: ReservationFormProps) => {
    const id = useId();

    const dateId = id + "-date";
    const date = new Date();
    const now = date.toISOString().substring(0, 10);
    if (date.getMonth() === 11) {
        date.setMonth(0);
    }
    else {
        date.setMonth(date.getMonth() + 1);
    }
    const max = date.toISOString().substring(0, 10);

    const dateRef = useRef<HTMLInputElement>(null);

    return (
        <form
            className="border-zinc-50 border-2 rounded-md p-4"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(dateRef.current?.value);
            }}>
            <label className="block text-sm mb-1" htmlFor={dateId}>Reservation date:</label>
            <input className="block mb-2 border border-zinc-50 [color-scheme:dark]" type="date" name="date" id={dateId} ref={dateRef} required min={now} max={max} defaultValue={now}/>
            <Button className="bg-yellow-600">Reserve</Button>
        </form>
    );
}

export default ReservationForm;
