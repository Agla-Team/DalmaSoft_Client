import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Per notifiche
import { Link } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Email di reset inviata! Controlla la tua casella di posta.");
      } else {
        toast.error(data.message || "Errore nel reset della password.");
      }
    } catch (error) {
      toast.error("Errore di connessione al server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Recupera Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Inserisci la tua email</Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-red-700 text-white border-gray-600 mb-4"
              />
            </div>
            <Button type="submit" className="relative right-0 w-40 bg-gray-600 hover:bg-gray-700 text-white" disabled={loading}>
              {loading ? "Invio in corso..." : "Invia richiesta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-400">
          <Link to="/login" className="text-gray-400 hover:underline">
          Torna al Login...
          </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}