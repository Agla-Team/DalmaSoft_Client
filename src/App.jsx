import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import InizializeAdmin from "./pages/Inizialize";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/UserDashboard";
import UserControl from "./pages/UserManagement";
import AutoGest from "./pages/autoGest";
import AutoNewInfinityInterne from "./pages/nuoveStockIntInfinity";
import AutoNewInfinityEsterne from "./pages/nuoveStockExtInfinity";
import Inventory_New from "./pages/Inventory_New";
import InventariatePage from "./pages/InventariatePage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import corretto
import { SocketContextProvider } from "./context/socketContext";

function App() {
    return (
        <SocketContextProvider>
            <Routes>
                {/* Rotte pubbliche */}
                <Route path="/login" element={<Login />} />
                <Route path="/initialize" element={<InizializeAdmin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Rotte protette */}
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/user-dashboard"
                        index
                        element={<UserDashboard />}
                    />
                    <Route path="/user-management" element={<UserControl />} />
                    <Route path="/autoPark" element={<AutoGest />} />
                    <Route path="/invent_nuove" element={<Inventory_New />} />
                    <Route
                        path="/inventariate"
                        element={<InventariatePage />}
                    />
                    {/*ROTTE LISTE AUTO */}
                    <Route
                        path="/infinity_interno"
                        element={<AutoNewInfinityInterne />}
                    />
                    <Route
                        path="/infinity_esterno"
                        element={<AutoNewInfinityEsterne />}
                    />
                </Route>

                {/* Redirect per tutte le route non esistenti */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </SocketContextProvider>
    );
}

export default App;
