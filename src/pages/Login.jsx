import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
//import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { postRequest } from "@/lib/service";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const token = localStorage.getItem("token");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const { token } = await postRequest(
                `${baseUrl}/api/auth/login`,
                JSON.stringify({ email, password })
            );

            localStorage.setItem("token", token);
            navigate("/user-dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    if (token) {
        return <Navigate to="/user-dashboard" />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-white">
            <Card className="w-full max-w-md border-none shadow-none">
                <CardHeader className="text-center">
                    <CardTitle className=" text-red-500 text-3xl md:text-4xl font-bold">
                        Benvenuto
                    </CardTitle>
                    <p className="text-gray-500">Accedi per continuare</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label className="text-gray-500">Email</Label>
                            <Input
                                type="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="text-gray-800 border-gray-600"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-500">Password</Label>
                            <Input
                                type="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="text-gray-800 border-gray-600 mb-4"
                            />
                        </div>
                        {error && (
                            <p className="text-red-400 text-sm text-center">
                                {error}
                            </p>
                        )}
                        <Button
                            type="submit"
                            className="relative right-0 w-20 bg-gray-600 hover:bg-gray-700 text-white"
                        >
                            Accedi
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-gray-400">
                        <Link
                            to="/forgot-password"
                            className="text-gray-400 hover:underline"
                        >
                            Password dimenticata?
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
