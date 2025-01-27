import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

const AuthRoute = ({ element }: { element: JSX.Element }) => {
    const { user } = useAuth();
    return user ? element : <Navigate to="/" />;
}

export default AuthRoute;
