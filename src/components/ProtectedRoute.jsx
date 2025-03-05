import { Navigate, Outlet } from "react-router-dom";
import Dashboard from "../pages/Dashboard"; // Percorso corretto per importarlo
import { useState } from "react";

const ProtectedRoute = () => {
    const [token, setToken] = useState(() => {
        const token = localStorage.getItem("token");
        return token ? token : null;
    });

    return token ? (
        <Dashboard>
            <Outlet />
        </Dashboard>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;
