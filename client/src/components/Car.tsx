import { formatDistanceToNow } from "date-fns";
import Placeholder from "../assets/240x120.svg";
import { CarData } from "../utilities";

type CarProps = {
    className?: string;
} & CarData;

const Car = ({ className = "", name, description, price, imageUrl, visibility, createdAt, updatedAt }: CarProps) => {
    return (
        <div className={`flex border-2 ${visibility === "public" ? "border-primary" : "border-secondary/50"} rounded-md ${className}`}>
            <img className="object-cover" width={240} src={imageUrl ? `/${imageUrl}` : Placeholder} alt={name} />
            <div className="p-4">
                <h2 className="text-xl font-bold mb-1">{name}</h2>
                <p className="text-sm text-secondary mb-2">{description ?? "No description provided."}</p>
                <p className="text-xl font-semibold mb-1">${price.toFixed(2)}<span className="text-sm text-secondary"> / day</span></p>
                <p className="text-sm text-secondary">Created: {formatDistanceToNow(createdAt, { addSuffix: true })}</p>
                <p className="text-sm text-secondary">Last updated: {formatDistanceToNow(updatedAt, { addSuffix: true })}</p>
            </div>
        </div>
    );
}

export default Car;
