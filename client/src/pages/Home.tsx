import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

const Home = () => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/cars" />
    }

    return (
        <div className="flex flex-col justify-center items-center text-center mx-auto">
            <h1 className="text-accent font-bold text-5xl mb-8">Car Rental Service</h1>
            <div className="flex gap-3">
                <Link className="w-36 bg-background-secondary hover:opacity-80 text-2xl font-semibold py-2 rounded-lg transition-opacity" to="/login">Log in</Link>
                <Link className="w-36 bg-accent hover:opacity-80 text-2xl font-semibold py-2 rounded-lg transition-opacity" to="/signup">Sign up</Link>
            </div>
        </div>
    );
}

export default Home;
