import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import UserForm from "../components/UserForm";

const Signup = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSignup = async (email?: string, password?: string, admin?: boolean) => {
        setError(undefined);
        try {
            const res = await fetch("/api/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, admin }),
            });
            const json = await res.json();
            if (res.ok) {
                login(json);
                navigate("/");
            }
            else {
                setError(json.error);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="my-16 min-w-full mx-auto">
            <UserForm showAdmin buttonText="Sign up" handleSubmit={handleSignup} error={error}/>
        </div>
    );
}

export default Signup;
