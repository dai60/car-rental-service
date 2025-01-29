import { ClassName, ReservationData } from "../utilities";

type ReservationProps = {

} & ReservationData & ClassName;

const Reservation = ({ className = "", date, status, user }: ReservationProps) => {
    let statusColor;
    switch (status) {
        case "pending":
            statusColor = "text-zinc-400";
            break;
        case "accepted":
            statusColor = "text-zinc-50";
            break;
        case "rejected":
            statusColor = "text-red-500";
            break;
        case "ready":
            statusColor = "text-green-500";
            break;
    }

    return (
        <div className={"border-2 border-zinc-50 rounded-md " + className}>
            <div className="flex p-4">
                <div>
                    <h2 className="text-xl font-bold">Reservation</h2>
                    <p>Date: {date.substring(0, 10)}</p>
                    {typeof user !== "string" && <p>Reserved by: {user.email}</p>}
                </div>
                <div className="ml-auto">
                    <p className="mb-2 text-right">Status: <span className={`${statusColor} capitalize`}>{status}</span></p>
                </div>
            </div>
        </div>
    );
}

export default Reservation;
