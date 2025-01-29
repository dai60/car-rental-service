import { ClassName, ReservationData } from "../utilities";
import Button from "./Button";
import Equipment from "./Equipment";

type ReservationProps = {

} & ReservationData & ClassName;

const Reservation = ({ className = "", date, status, equipment, user }: ReservationProps) => {
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

    console.log(equipment);

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
                    {/* <Button className="bg-yellow-600 block mb-2">Change date</Button>
                    <Button className="bg-red-600 block">Cancel</Button> */}
                </div>
            </div>
            {typeof equipment !== "string" && <Equipment {...equipment} />}
        </div>
    );
}

export default Reservation;
