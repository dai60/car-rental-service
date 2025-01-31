import { useId, useRef, useState } from "react";
import Button from "./Button";

type CarFormProps = {
    error?: string;
    handleSubmit: (name?: string, description?: string, price?: number, image?: File, visibility?: string) => Promise<void>;
    handleDelete?: () => Promise<void>;
    defaultValues?: {
        name?: string;
        description?: string;
        price?: number;
        visibility?: string;
    }
}

const CarForm = ({ error, handleSubmit, handleDelete, defaultValues }: CarFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

    const formRef = useRef<HTMLFormElement>(null);

    const id = useId();
    const nameId = id + "-name";
    const descriptionId = id + "-description";
    const priceId = id + "-price";
    const visibilityId = id + "-visibility";

    return (
        <form
            className="w-full border-2 border-primary p-4"
            ref={formRef}
            onSubmit={async e => {
                e.preventDefault();

                const form = formRef.current;
                setIsSubmitting(true);
                await handleSubmit(form?.nameInput.value, form?.description.value, form?.price.valueAsNumber, form?.image.files[0], form?.visibility.value);

                setIsSubmitting(false);
                setImagePreview(undefined);
                form?.reset();
            }}>
            <label className="block text-sm mb-1" htmlFor={nameId}>Name</label>
            <input className="w-full bg-background-secondary mb-2" type="text" name="nameInput" id={nameId} disabled={isSubmitting} defaultValue={defaultValues?.name} required />
            <label className="block text-sm mb-1" htmlFor={descriptionId}>Description</label>
            <textarea className="w-full bg-background-secondary mb-2" name="description" id={descriptionId} disabled={isSubmitting} rows={3} defaultValue={defaultValues?.description}></textarea>
            <label className="block text-sm mb-1" htmlFor={priceId}>Price</label>
            <input className="w-full bg-background-secondary mb-2" type="number" min="0" step="0.01" name="price" id={priceId} disabled={isSubmitting} defaultValue={defaultValues?.price?.toFixed(2)} required />
            <label className="block text-sm mb-1">Image</label>
            <input className="w-full file:bg-background-secondary file:px-2 file:me-2 cursor-pointer mb-2" name="image" type="file" accept="image/*" onChange={(e) => {
                const file = formRef.current?.image.files[0];
                if (file) {
                    setImagePreview(URL.createObjectURL(file));
                }
            }} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="h-32 mb-2"></img>}
            <label className="block text-sm mb-1" htmlFor={visibilityId}>Visibility</label>
            <select className="bg-background-secondary w-36 mb-2" name="visibility" id={visibilityId} disabled={isSubmitting} defaultValue={defaultValues?.visibility} required>
                <option value="draft">Draft</option>
                <option value="public">Public</option>
            </select>
            {error && <p className="text-error text-semibold">{error}</p>}
            <div>
                <Button disabled={isSubmitting} submit={true} className="bg-accent mt-4 me-2">Save</Button>
                {handleDelete && (
                    <Button disabled={isSubmitting} className="bg-error mt-4"
                        onClick={e => {
                            e.preventDefault();
                            handleDelete();
                        }}>
                            Delete
                    </Button>
                )}
            </div>
        </form>
    );
}

export default CarForm;
