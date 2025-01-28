import { useId } from "react";

const ReservationForm = () => {
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

    return (
        <form className="border-zinc-50 border-2 rounded-md p-4">
            <label className="block text-sm mb-1" htmlFor={dateId}>Reservation date:</label>
            <input className="border border-zinc-50 [color-scheme:dark]" type="date" name="date" id={dateId} required min={now} max={max} defaultValue={now}/>
        </form>
    );
}

export default ReservationForm;
