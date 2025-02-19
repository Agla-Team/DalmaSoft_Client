import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/inizialize`, {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          });
          
        console.log("Status:", response.status);
        console.log("Headers:", response.headers);

        // Verifica se la risposta è ok (status 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Verifica il contenuto della risposta prima di parsare
        const text = await response.text();
        console.log("Response text:", text);

        // Prova a parsare solo se c'è contenuto
        if (!text) {
          throw new Error("Risposta vuota dal server");
        }

        const data = JSON.parse(text);
        console.log("Dati parsati:", data);

        if (data.exists) {
          setStatus("success");
          console.log(data.message);
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setStatus("success");
          console.log("Admin creato:", data.admin);
          setTimeout(() => navigate("/login"), 2000);
        }
    } catch (error) {
        console.error("Errore nell'inizializzazione dell'app:", error);
        setError(error.message || "Si è verificato un errore durante l'inizializzazione");
        setStatus("error");
      }
    };

    initializeApp();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Verifica iniziale...</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "verifying" && (
            <>
              <p className="text-gray-600">Attendere mentre verifichiamo il sistema...</p>
              <Button className="mt-4 w-full" disabled>
                Verifica in corso...
              </Button>
            </>
          )}
          
          {status === "success" && (
            <Alert>
              <AlertDescription className="text-green-600">
                Verifica completata con successo! Reindirizzamento in corso...
              </AlertDescription>
            </Alert>
          )}
          
          {status === "error" && (
            <Alert>
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}