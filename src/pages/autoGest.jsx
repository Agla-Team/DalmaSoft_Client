import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const backUrl = import.meta.env.VITE_BACKEND_URL;
const frontUrl = import.meta.env.VITE_FRONT_URL;

export default function AutoGest() {
    const [data, setData] = useState({
        parcoAuto: { count: 0, valore: 0 },
        autoNuove: { count: 0, valore: 0 },
        autoUsate: { count: 0, valore: 0 },
        autoVirtuali: { count: 0, valore: 0 },
        autoAssegnate: { count: 0, valore: 0 },
        dettagliPerBrand: {},
        brands: [], // Aggiungi questa inizializzazione
    });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${backUrl}/api/auto/autogest`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Se la rotta è protetta
        },
      });

      if (!response.ok) {
        throw new Error(`Errore: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      setData({
        parcoAuto: { count: result.totaleInStock, valore: result.valoreParcoAuto },
        autoNuove: { count: result.dettaglio.autoNuove.inStock, valore: result.dettaglio.autoNuove.valore },
        autoUsate: { count: result.dettaglio.autoUsate.inStock, valore: result.dettaglio.autoUsate.valore },
        autoVirtuali: { count: result.dettaglio.autoNuove.virtuali, valore: result.dettaglio.autoNuove.valoreVirtuali },
        autoAssegnate: { count: result.totaleAssegnate, valore: result.valoreAssegnate },
        dettagliPerBrand: result.dettagliPerBrand || {},
        brands: result.brands || [],
      });
    } catch (error) {
      console.error("Errore nel caricamento dati:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Esegui subito il fetch dei dati
    const interval = setInterval(() => {
        fetchData();
    }, 60000); // 1 minuti

    return () => clearInterval(interval); // Pulizia dell'intervallo quando il componente viene smontato
}, []);

  return (
    <div className="p-6 space-y-6">
      {/* 5 Card Principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Parco Auto In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.parcoAuto.count} veicoli</p>
            <p className="text-lg text-gray-500">Valore: €{data.parcoAuto.valore.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuove In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.autoNuove.count} veicoli</p>
            <p className="text-lg text-gray-500">Valore: €{data.autoNuove.valore.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usate In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.autoUsate.count} veicoli</p>
            <p className="text-lg text-gray-500">Valore: €{data.autoUsate.valore.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Virtuali</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.autoVirtuali.count} veicoli</p>
            <p className="text-lg text-gray-500">Valore: €{data.autoVirtuali.valore.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assegnate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.autoAssegnate.count} veicoli</p>
            <p className="text-lg text-gray-500">Valore: €{data.autoAssegnate.valore.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Schede per ogni brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.dettagliPerBrand && Object.keys(data.dettagliPerBrand).length > 0 ? (
                    Object.entries(data.dettagliPerBrand).map(([brand, details]) => (
                        <Card key={brand} className="shadow-lg transition-transform transform hover:scale-105">
                            <CardHeader className="flex items-center">
                                <img
                                    src={details.logo_url || "./logo/default.png"}
                                    alt={brand}
                                    className="w-24 h-24 object-contain mr-4"
                                />
                                <CardTitle></CardTitle>
                            </CardHeader>
                            <CardContent>
                                {details.autoNuove && (
                                    <div className="space-y-2">
                                        <p className="text-gray-700">🚗 <strong>Nuove In Stock:</strong> {details.autoNuove["In Stock"]?.count || 0} unità</p>
                                        <p className="text-gray-700">💰 <strong>Valore Nuove:</strong> € {details.autoNuove["In Stock"]?.valore?.toLocaleString() || "0"}</p>
                                        <p className="text-gray-700">🌐 <strong>Virtuali:</strong> {details.autoNuove["Virtuale"]?.count || 0} unità</p>
                                        <p className="text-gray-700">💵 <strong>Valore Virtuali:</strong> € {details.autoNuove["Virtuale"]?.valore?.toLocaleString() || "0"}</p>
                                        <p className="text-gray-700">🛠 <strong>Assegnato:</strong> {details.autoNuove["Assegnato"]?.count || 0} unità</p>
                                        <p className="text-gray-700">💵 <strong>Valore Assegnato:</strong> € {details.autoNuove["Assegnato"]?.valore?.toLocaleString() || "0"}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500">⚠️ Nessun dato disponibile...</p>
                )}
            </div>
        </div>
    );  
}