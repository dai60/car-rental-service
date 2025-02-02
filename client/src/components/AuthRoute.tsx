import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

type AuthRouteProps = {
    element: JSX.Element;
}

const AuthRoute = ({ element }: AuthRouteProps) => {
    const { user } = useAuth();
    return user ? element : <Navigate to="/" />;
}

export default AuthRoute;
