import { ClassName, ReservationData } from "../utilities";

type ReservationProps = {

} & ReservationData & ClassName;

const Reservation = ({ className = "", date, status, user }: ReservationProps) => {
    let statusColor;
    switch (status) {
        case "pending":
            statusColor = "text-secondary";
            break;
        case "accepted":
            statusColor = "text-primary";
            break;
        case "rejected":
            statusColor = "text-error";
            break;
        case "ready":
            statusColor = "text-ok";
            break;
    }

    return (
        <div className={`border-2 ${status === "pending" || status === "rejected" ? "border-secondary/50" : "border-primary"} rounded-md ${className}`}>
            <div className="flex flex-col sm:flex-row p-4">
                <div>
                    <h2 className="text-xl font-bold">Reservation</h2>
                    {date.end ? (
                        <p>Date: {date.start.substring(0, 10)} to {date.end.substring(0, 10)}</p>
                    ) : (
                        <p>Date: {date.start.substring(0, 10)}</p>
                    )}
                    {typeof user !== "string" && <p>Reserved by: {user.email}</p>}
                </div>
                <div className="sm:ml-auto">
                    <p className="sm:text-right">Status: <span className={`${statusColor} capitalize`}>{status}</span></p>
                </div>
            </div>
        </div>
    );
}

export default Reservation;
