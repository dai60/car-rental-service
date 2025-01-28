import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

type AuthRouteProps = {
    element: JSX.Element;
    admin?: boolean;
}

const AuthRoute = ({ element, admin = false }: AuthRouteProps) => {
    const { user } = useAuth();

    if (user) {
        if (!admin || user.admin) {
            return element;
        }
    }
    return <Navigate to="/" />;
}

export default AuthRoute;
