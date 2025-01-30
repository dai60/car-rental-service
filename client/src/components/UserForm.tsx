import { useId, useRef, useState } from "react";
import Button from "./Button";

type UserFormProps = {
    buttonText: string;
    handleSubmit: (email?: string, password?: string) => Promise<void>;
    error?: string;
}

const UserForm = ({ handleSubmit, error, buttonText }: UserFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const id = useId();

    const emailId = id + "-email";
    const passwordId = id + "-password";

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    return (
        <form
            className="border-2 border-primary max-w-lg mx-auto p-4"
            onSubmit={e => {
                setIsSubmitting(true);
                e.preventDefault();
                handleSubmit(emailRef.current?.value, passwordRef.current?.value);
                setIsSubmitting(false);
            }}>
            <label className="block text-sm mb-1" htmlFor={emailId}>E-Mail:</label>
            <input className="bg-background-secondary w-full px-2 py-1" type="email" name="email" id={emailId} ref={emailRef} />
            <label className="block text-sm mb-1" htmlFor={passwordId}>Password:</label>
            <input className="bg-background-secondary w-full px-2 py-1" type="password" name="password" id={passwordId} ref={passwordRef} />
            {error && <p className="text-error font-semibold mt-2">{error}</p>}
            <Button className="bg-accent mt-4" disabled={isSubmitting}>{buttonText}</Button>
        </form>
    );
}

export default UserForm;
