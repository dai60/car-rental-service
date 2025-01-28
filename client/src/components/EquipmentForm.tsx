import { useId, useRef } from "react";

type EquipmentFormProps = {
    error?: string;
    handleSubmit: (name?: string, description?: string, price?: number, visibility?: string) => Promise<void>;
}

const EquipmentForm = ({ error, handleSubmit }: EquipmentFormProps) => {
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
            className="w-full border-2 border-zinc-50 mt-8 p-4"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(nameRef.current?.value, descriptionRef.current?.value, priceRef.current?.valueAsNumber, visibilityRef.current?.value);
            }}>
            <label className="block text-sm mb-1" htmlFor={nameId}>Name</label>
            <input className="w-full mb-2" type="text" name="name" id={nameId} ref={nameRef} />
            <label className="block text-sm mb-1" htmlFor={descriptionId}>Description</label>
            <textarea className="w-full mb-2" name="description" id={descriptionId} rows={3} ref={descriptionRef}></textarea>
            <label className="block text-sm mb-1" htmlFor={priceId}>Price</label>
            <input className="w-full mb-2" type="number" min="0" step="0.01" name="price" id={priceId} ref={priceRef} />
            <label className="block text-sm mb-1" htmlFor={visibilityId}>Visibility</label>
            <select className="w-36 mb-2" name="visibility" id={visibilityId} ref={visibilityRef}>
                <option className="bg-black" value="draft">Draft</option>
                <option className="bg-black" value="public">Public</option>
            </select>
            {error && <p className="text-red-500 text-semibold">{error}</p>}
            <button className="block bg-yellow-600 text-lg rounded-md w-32 py-1 mt-4">Save</button>
        </form>
    );
}

export default EquipmentForm;
