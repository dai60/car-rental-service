import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="bg-background-alt">
            <div className="flex flex-col sm:flex-row max-w-6xl mx-auto px-4 py-4 items-center justify-between">
                <Link to="/" className="font-bold text-lg text-accent">Equipment Rental Service</Link>
                {user && (
                    <div className="flex flex-col items-center sm:flex-row gap-1 sm:gap-4 mt-2 sm:mt-0">
                        <span>{user.email} {user.admin ?
                            (<span className="text-accent">(admin)</span>) :
                            (<span className="text-secondary">(user)</span>)}
                        </span>
                        <Link to="/reservations" className="hover:opacity-80 transition-opacity">
                            View Reservations
                        </Link>
                        <button
                            onClick={() => {
                                logout();
                                navigate("/");
                            }}
                            className="cursor-pointer hover:opacity-80 transition-opacity">
                                Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
