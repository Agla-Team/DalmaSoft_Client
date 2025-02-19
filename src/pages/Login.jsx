import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
//import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

console.log("Base URL:", baseUrl); // Per verificare in console

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error("Credenziali non valide");
      }
      
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/user-dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      <Card className="w-full max-w-md shadow-lg border border-gray-100 bg-gray-100">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Benvenuto</CardTitle>
          <p className="text-gray-400">Accedi per continuare</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-gray-400">Email</Label>
              <Input
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-red-700 text-white border-gray-600"
              />
            </div>
            <div>
              <Label className="text-gray-400">Password</Label>
              <Input
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-red-700 text-white border-gray-600 mb-4"
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <Button type="submit" className="relative right-0 w-20 bg-gray-600 hover:bg-gray-700 text-white">Accedi</Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-400">
          <Link to="/forgot-password" className="text-gray-400 hover:underline">
            Password dimenticata?
          </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
