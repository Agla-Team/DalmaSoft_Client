import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

// Imposta gli URL per il backend e il frontend dalle variabili d'ambiente, con fallback
const backUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const frontUrl = import.meta.env.VITE_FRONT_URL || "http://localhost:3000";

export default function InventariatePage() {
  const [autoInventariate, setAutoInventariate] = useState([]);

  useEffect(() => {
    async function fetchInventariate() {
      try {
        // Assumi che l'endpoint per ottenere tutte le auto inventariate sia "/api/inventario/inventariate"
        const res = await fetch(`${backUrl}/api/inventario/inventariate`);
        if (!res.ok) {
          throw new Error(`Errore: ${res.status}`);
        }
        const data = await res.json();
        setAutoInventariate(data);
      } catch (error) {
        console.error("Errore nel recupero delle auto inventariate:", error);
      }
    }
    fetchInventariate();
  }, []);

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {autoInventariate.map((auto) => (
        <Card key={auto.id_veicolo} className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{auto.marca}</CardTitle>
            <p className="text-sm text-gray-600">{auto.modello}</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {/* QR Code: crea un codice che punta all'URL dell'auto, ad esempio frontUrl/auto/{id_veicolo} */}
            <QRCodeSVG value={`${frontUrl}/auto/${auto.id_veicolo}`} size={128} />
            {/* Visualizza il telaio centrato */}
            {/* Sezione con targa e bottone "Stampa QRCODE" */}
            <div className="flex flex-col items-center space-y-1">
                <span className="text-base font-medium">{auto.telaio}</span>
                <span className="text-base font-medium">{auto.targa ? auto.targa : '-'}</span>
                <Button variant="outline" size="sm">
                    Stampa QRCODE
                </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              MODIFICA
            </Button>
            <Button variant="outline" size="sm">
              SPOSTA
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
