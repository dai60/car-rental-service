import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/Auth";
import Layout from "./Layout";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRoute from "./components/AuthRoute";
import CarList, { carListLoader } from "./pages/CarList";
import CarDetails, { carDetailsLoader } from "./pages/CarDetails";
import ReservationList, { reservationListLoader } from "./pages/ReservationList";
import ReservationDetails, { reservationDetailsLoader } from "./pages/ReservationDetails";

function App() {
    return (
        <AuthProvider>
            <Router />
        </AuthProvider>
    );
}

export default App;

function Router() {
    const { user } = useAuth();

    const router = createBrowserRouter([{
        path: "/",
        element: <Layout />,
        children: [{
            errorElement: <ErrorPage />,
            children: [
                {
                    index: true,
                    element: <Home />,
                },
                {
                    path: "/login",
                    element: <Login />
                },
                {
                    path: "/signup",
                    element: <Signup />,
                },
                {
                    path: "/cars",
                    element: <AuthRoute element={<CarList />} />,
                    loader: carListLoader(user?.token),
                },
                {
                    path: "/cars/:id",
                    element: <AuthRoute element={<CarDetails />} />,
                    loader: carDetailsLoader(user?.token),
                },
                {
                    path: "/reservations",
                    element: <AuthRoute element={<ReservationList />} />,
                    loader: reservationListLoader(user?.token, user?.admin),
                },
                {
                    path: "/reservations/:id",
                    element: <AuthRoute element={<ReservationDetails />} />,
                    loader: reservationDetailsLoader(user?.token),
                },
                {
                    path: "*",
                    element: <ErrorPage message="404 Not Found" />
                }
            ],
        }],
    }]);

    return (
        <RouterProvider router={router} />
    )
}
