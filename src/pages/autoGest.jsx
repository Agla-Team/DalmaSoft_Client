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
      const interval = setInterval(fetchData, 900000); // 15 minuti
      return () => clearInterval(interval); // Pulizia quando il componente si smonta
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

  return (
    <div className="p-6 space-y-6">
      {/* 5 Card Principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border border-red-700 rounded-md">
          <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
            <CardTitle className="text-sm text-white font-light">Auto In Stock</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold">{data.parcoAuto.count} veicoli</p>
            <p className="text-lg text-gray-500">Valore: €{data.parcoAuto.valore.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border border-amber-700 rounded-md">
          <CardHeader className="p-2 bg-gradient-to-br from-amber-600 to-amber-500 rounded-t">
            <CardTitle className="text-sm text-white font-light">Nuove In Stock</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold">{data.autoNuove.count} veicoli</p>
            <p className="text-lg text-gray-500">Valore: €{data.autoNuove.valore.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-700 rounded-md">
          <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
            <CardTitle className="text-sm text-white font-light">Usate In Stock</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold">{data.autoUsate.count} veicoli</p>
            <p className="text-lg text-gray-500">Valore: €{data.autoUsate.valore.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-700 rounded-md">
          <CardHeader className="p-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-t">
            <CardTitle className="text-sm text-white font-light">Virtuali</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold text-gray-800">{data.autoVirtuali.count} veicoli</p>
            <p className="text-lg text-gray-400">Valore: €{data.autoVirtuali.valore.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border border-sky-700 rounded-md">
          <CardHeader className="p-2 bg-gradient-to-br from-sky-900 to-sky-800 rounded-t">
            <CardTitle className="text-sm text-white font-light">Assegnate</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold">{data.autoAssegnate.count} veicoli</p>
            <p className="text-lg text-gray-500">Valore: €{data.autoAssegnate.valore.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Schede per ogni brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.dettagliPerBrand && Object.keys(data.dettagliPerBrand).length > 0 ? (
                    Object.entries(data.dettagliPerBrand).map(([brand, details]) => (
                        <Card key={brand} className="shadow-lg border border-red-700 rounded-md">
                            <CardHeader className="flex items-center">
                                <img
                                    src={details.logo_url || "./logo/default.png"}
                                    alt={brand}
                                    className="w-20 h-20 object-contain mr-auto"
                                />
                                <CardTitle></CardTitle>
                            </CardHeader>
                            <CardContent>
                                {details.autoNuove && (
                                  <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-4">
                                    <div className="space-y-2">
                                        <p className="text-gray-700 text-md"><strong>Nuove In Stock:</strong> {details.autoNuove["In Stock"]?.count || 0} unità</p>
                                        <p className="text-gray-700 text-md"><strong>Assegnato:</strong> {details.autoNuove["Assegnato"]?.count || 0} unità</p>
                                        <p className="text-gray-700 text-md"><strong>Virtuali:</strong> {details.autoNuove["Virtuale"]?.count || 0} unità</p>
                                    </div>
                                    <div className="space-y-2 border-l border-gray-300 pl-4">
                                        <p className="text-gray-700 text-md"><strong>Valore Nuove:</strong> € {details.autoNuove["In Stock"]?.valore?.toLocaleString() || "0"}</p>
                                        <p className="text-gray-700 text-md"><strong>Valore Assegnato:</strong> € {details.autoNuove["Assegnato"]?.valore?.toLocaleString() || "0"}</p>
                                        <p className="text-gray-700 text-md"><strong>Valore Virtuali:</strong> € {details.autoNuove["Virtuale"]?.valore?.toLocaleString() || "0"}</p> 
                                    </div>
                                  </div>
                                )}
                                {details.autoUsate && (
                                  <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-4">
                                  <div className="space-y-2">
                                      <p className="text-gray-700 text-md"><strong>Usate In Stock:</strong> {details.autoUsate["In Stock"]?.count || 0} unità</p>
                                      <p className="text-gray-700 text-md"><strong>Assegnato:</strong> {details.autoUsate["Assegnato"]?.count || 0} unità</p>
                                  </div>
                                  <div className="space-y-2 border-l border-gray-300 pl-4">
                                      <p className="text-gray-700 text-md"><strong>Valore Usate:</strong> € {details.autoUsate["In Stock"]?.valore?.toLocaleString() || "0"}</p>
                                      <p className="text-gray-700 text-md"><strong>Valore Assegnato:</strong> € {details.autoUsate["Assegnato"]?.valore?.toLocaleString() || "0"}</p>
                                  </div>
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