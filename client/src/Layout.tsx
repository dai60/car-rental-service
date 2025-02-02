import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen font-roboto bg-background text-primary">
            <Header />
            <main className="flex flex-1 w-full max-w-6xl mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
