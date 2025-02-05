import { formatDistanceToNow } from "date-fns";
import Placeholder from "../assets/240x120.svg";
import { CarData } from "../utilities";
import { useState } from "react";
import Modal from "./Modal";

type CarProps = {
    className?: string;
    modal?: boolean;
} & CarData;

const Car = ({ className = "", modal = false, model, description, price, imageUrl, visibility, createdAt, updatedAt }: CarProps) => {
    const [imageModal, setImageModal] = useState(false);

    return (
        <>
            <div className={`flex flex-col sm:flex-row items-start sm:items-stretch border-2 ${visibility === "public" ? "border-primary" : "border-secondary/50"} overflow-hidden rounded-md ${className}`}>
                <img onClick={() => setImageModal(true)} className="object-cover object-center w-full sm:min-w-72 min-h-48 sm:max-w-72 max-h-48 cursor-pointer" src={imageUrl ? `/${imageUrl}` : Placeholder} alt={model} />
                <div className="p-4 flex flex-col">
                    <h2 className="text-xl font-bold mb-1">{model}</h2>
                    <p className="text-sm text-secondary mb-2">{description ?? "No description provided."}</p>
                    <p className="text-xl mt-auto font-semibold mb-1">${price.toFixed(2)}<span className="text-sm text-secondary"> / day</span></p>
                    <p className="text-sm text-secondary">Created: {formatDistanceToNow(createdAt, { addSuffix: true })}</p>
                    <p className="text-sm text-secondary">Last updated: {formatDistanceToNow(updatedAt, { addSuffix: true })}</p>
                </div>
            </div>
            {modal && imageModal && (
                <Modal onClose={() => setImageModal(false)}>
                    <img className="object-contain max-w-[80vw] max-h-[80vh]" src={imageUrl ? `/${imageUrl}` : Placeholder} alt={model}></img>
                </Modal>
            )}
        </>
    );
}

export default Car;
