import { formatDistanceToNow } from "date-fns";
import Placeholder from "../public/240x120.svg";
import { EquipmentData } from "../utilities";

type EquipmentProps = {
    className?: string;
} & EquipmentData;

const Equipment = ({ className = "", name, description, price, createdAt, updatedAt }: EquipmentProps) => {
    return (
        <div className={"flex border-2 border-zinc-50 rounded-md " + className}>
            <img className="w-[240] min-h-full object-cover" src={Placeholder} alt={name} />
            <div className="p-4">
                <h2 className="text-xl font-bold mb-1">{name}</h2>
                <p className="text-sm text-zinc-400 mb-2">{description ?? "No description provided."}</p>
                <p className="text-xl font-semibold mb-1">${price.toFixed(2)}</p>
                <p className="text-sm text-zinc-400">Created: {formatDistanceToNow(createdAt, { addSuffix: true })}</p>
                <p className="text-sm text-zinc-400">Last updated: {formatDistanceToNow(updatedAt, { addSuffix: true })}</p>
            </div>
        </div>
    );
}

export default Equipment;
