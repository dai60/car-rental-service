import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/Auth";
import Layout from "./Layout";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRoute from "./components/AuthRoute";
import EquipmentList, { equipmentListLoader } from "./pages/EquipmentList";
import EquipmentDetails, { equipmentDetailsLoader } from "./pages/EquipmentDetails";

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
                    element: <Login />,
                },
                {
                    path: "/signup",
                    element: <Signup />,
                },
                {
                    path: "/equipment",
                    element: <AuthRoute element={<EquipmentList />} />,
                    loader: equipmentListLoader(user?.token),
                },
                {
                    path: "/equipment/:id",
                    element: <AuthRoute element={<EquipmentDetails />} />,
                    loader: equipmentDetailsLoader(user?.token),
                },
            ],
        }],
    }]);

    return (
        <RouterProvider router={router} />
    )
}
