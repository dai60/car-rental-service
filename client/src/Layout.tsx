import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-zinc-50">
            <Header />
            <main className="flex flex-1 w-full max-w-6xl mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
