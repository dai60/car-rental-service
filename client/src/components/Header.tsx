import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="bg-black">
            <div className="flex max-w-6xl mx-auto px-4 py-4 items-center justify-between">
                <Link to="/" className="font-bold text-lg text-yellow-600">Equipment Rental Service</Link>
                {user && (
                    <div>
                        <span className="me-4">{user.email} {user.admin ?
                            (<span className="text-yellow-600">(admin)</span>) :
                            (<span className="text-zinc-400">(user)</span>)}
                        </span>
                        <Link to="/reservations" className="hover:opacity-80 transition-opacity me-4">
                            My Reservations
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
