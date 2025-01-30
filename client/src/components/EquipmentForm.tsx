import { useId, useRef } from "react";
import Button from "./Button";

type EquipmentFormProps = {
    error?: string;
    handleSubmit: (name?: string, description?: string, price?: number, visibility?: string) => Promise<void>;
    handleDelete?: () => Promise<void>;
    defaultValues?: {
        name?: string;
        description?: string;
        price?: number;
        visibility?: string;
    }
}

const EquipmentForm = ({ error, handleSubmit, handleDelete, defaultValues }: EquipmentFormProps) => {
    const id = useId();

    const nameId = id + "-name";
    const descriptionId = id + "-description";
    const priceId = id + "-price";
    const visibilityId = id + "-visibility";

    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const visibilityRef = useRef<HTMLSelectElement>(null);

    return (
        <form
            className="w-full border-2 border-primary p-4"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(nameRef.current?.value, descriptionRef.current?.value, priceRef.current?.valueAsNumber, visibilityRef.current?.value);
            }}>
            <label className="block text-sm mb-1" htmlFor={nameId}>Name</label>
            <input className="w-full bg-background-secondary mb-2" type="text" name="name" id={nameId} ref={nameRef} defaultValue={defaultValues?.name} required />
            <label className="block text-sm mb-1" htmlFor={descriptionId}>Description</label>
            <textarea className="w-full bg-background-secondary mb-2" name="description" id={descriptionId} rows={3} ref={descriptionRef} defaultValue={defaultValues?.description}></textarea>
            <label className="block text-sm mb-1" htmlFor={priceId}>Price</label>
            <input className="w-full bg-background-secondary mb-2" type="number" min="0" step="0.01" name="price" id={priceId} ref={priceRef} defaultValue={defaultValues?.price?.toFixed(2)} required />
            <label className="block text-sm mb-1" htmlFor={visibilityId}>Visibility</label>
            <select className="bg-background-secondary w-36 mb-2" name="visibility" id={visibilityId} ref={visibilityRef} defaultValue={defaultValues?.visibility} required>
                <option value="draft">Draft</option>
                <option value="public">Public</option>
            </select>
            {error && <p className="text-error text-semibold">{error}</p>}
            <div>
                <Button submit={true} className="bg-accent mt-4 me-2">Save</Button>
                {handleDelete && <Button className="bg-red mt-4" onClick={handleDelete}>Delete</Button>}
            </div>
        </form>
    );
}

export default EquipmentForm;
