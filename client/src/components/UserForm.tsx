import { useId, useRef, useState } from "react";
import Button from "./Button";

type UserFormProps = {
    buttonText: string;
    handleSubmit: (email?: string, password?: string, admin?: boolean) => Promise<void>;
    showAdmin?: boolean;
    error?: string;
}

const UserForm = ({ handleSubmit, showAdmin = false, error, buttonText }: UserFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const id = useId();

    const emailId = id + "-email";
    const passwordId = id + "-password";
    const adminId = id + "-admin";

    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            className="border-2 border-primary w-full max-w-lg mx-auto p-4"
            ref={formRef}
            onSubmit={e => {
                setIsSubmitting(true);
                e.preventDefault();
                handleSubmit(formRef.current?.email.value, formRef.current?.password.value, formRef.current?.admin?.checked);
                setIsSubmitting(false);
            }}>
            <label className="block text-sm mb-1" htmlFor={emailId}>E-Mail:</label>
            <input className="bg-background-secondary w-full mb-2 px-2 py-1" type="email" name="email" id={emailId} />
            <label className="block text-sm mb-1" htmlFor={passwordId}>Password:</label>
            <input className="bg-background-secondary w-full mb-2 px-2 py-1" type="password" name="password" id={passwordId} />
            {showAdmin && (
                <div className="block mb-2">
                    <input className="bg-background-secondary cursor-pointer" type="checkbox" name="admin" id={adminId} />
                    <label className="text-sm ps-2 mb-1 cursor-pointer" htmlFor={adminId}>Create Admin Account</label>
                </div>
            )}
            {error && <p className="text-error font-semibold mt-2">{error}</p>}
            <Button className="bg-accent mt-4 w-full sm:w-fit" disabled={isSubmitting}>{buttonText}</Button>
        </form>
    );
}

export default UserForm;
