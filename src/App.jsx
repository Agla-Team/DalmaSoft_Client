import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import InizializeAdmin from "./pages/Inizialize";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/UserDashboard";
import UserControl from "./pages/UserManagement";
import AutoGest from "./pages/autoGest";
import AutoNewInfinityInterne from "./pages/nuoveStockIntInfinity";
import AutoNewInfinityEsterne from "./pages/nuoveStockExtInfinity";
import InvUseDalma from "./pages/invUseDalma"
import AutoUsateInfinityEsterne from "./pages/usateStockExtInfinity"
import AutoUsateInfinityInterne from "./pages/usateStockIntInfinity"

import Inventory_New from "./pages/Inventory_New";
import InventariatePage from "./pages/InventariatePage";
import Planning from "./pages/planning";
import TestDashboard from "./pages/test";


import ProtectedRoute from "./components/ProtectedRoute"; // Import corretto
import { SocketContextProvider } from "./context/socketContext";
import { VehiclesContextProvider } from "./hooks/useVehicles";

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
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route path="/user-management" element={<UserControl />} />
                    <Route path="/autoPark" element={<AutoGest />} />
                    
        <Route path="/invent_nuove" element={<VehiclesContextProvider><Inventory_New /></VehiclesContextProvider>} />
                    <Route path="/inventariate" element={<InventariatePage />} />
                    {/*ROTTE LISTE AUTO */}
                    <Route path="/planning" element={<Planning />} />
                    <Route path="/infinity_interno" element={<AutoNewInfinityInterne />} />
                    <Route path="/infinity_esterno" element={<AutoNewInfinityEsterne />} />


                    <Route path="/infinity_interno_usate" element={<AutoUsateInfinityInterne />} />
                    <Route path="/infinity_esterno_usate" element={<AutoUsateInfinityEsterne />} />

                  <Route path="/dalma_usate" element={<InvUseDalma />} />
        <Route path="/test" element={<TestDashboard />} />
      </Route>

                {/* Redirect per tutte le route non esistenti */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </SocketContextProvider>
    );
}

export default App;
