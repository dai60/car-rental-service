import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

const Home = () => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/equipment" />
    }

    return (
        <div className="flex flex-col justify-center items-center text-center mx-auto">
            <h1 className="text-yellow-600 font-bold text-5xl mb-8">Equipment Rental Service</h1>
            <div className="flex gap-3">
                <Link className="w-36 bg-slate-600 hover:opacity-80 text-2xl font-semibold py-2 rounded-lg transition-opacity" to="/login">Log in</Link>
                <Link className="w-36 bg-yellow-600 hover:opacity-80 text-2xl font-semibold py-2 rounded-lg transition-opacity" to="/signup">Sign up</Link>
            </div>
        </div>
    );
}

export default Home;
