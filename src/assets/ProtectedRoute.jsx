import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Dashboard from "../pages/Dashboard"; // Percorso corretto per importarlo

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp > Date.now() / 1000; // Controlla se il token è ancora valido
  } catch (error) {
    return false;
  }
};

const ProtectedRoute = () => {
  return isAuthenticated() ? (
    <Dashboard> 
      <Outlet /> {/* Qui vengono renderizzate le pagine interne dentro Dashboard */}
    </Dashboard>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;

