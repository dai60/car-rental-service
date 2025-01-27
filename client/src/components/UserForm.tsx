import { useId, useRef, useState } from "react";

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
            className="border-2 border-yellow-600 max-w-lg mx-auto p-4"
            onSubmit={e => {
                setIsSubmitting(true);
                e.preventDefault();
                handleSubmit(emailRef.current?.value, passwordRef.current?.value);
                setIsSubmitting(false);
            }}>
            <label className="block text-sm mb-1" htmlFor={emailId}>E-Mail:</label>
            <input className="bg-slate-600 w-full px-2 py-1" type="email" name="email" id={emailId} ref={emailRef} />
            <label className="block text-sm mb-1" htmlFor={passwordId}>Password:</label>
            <input className="bg-slate-600 w-full px-2 py-1" type="password" name="password" id={passwordId} ref={passwordRef} />
            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
            <button className="cursor-pointer font-semibold bg-yellow-600 rounded-lg mt-4 px-4 py-2" disabled={isSubmitting}>{buttonText}</button>
        </form>
    );
}

export default UserForm;
