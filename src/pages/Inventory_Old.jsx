import React, { useEffect, useState } from "react";
import LeftPanel from "./LeftPanel"; // Componente per la parte sinistra (inserimento telaio, riepilogo, note e condizione)
import RightPanel from "./RightPanel"; // Componente per la parte destra con conteggi, brand e tabella auto non inventariate

export default function InventarioPage() {
  // Dati di esempio da passare alla parte sinistra
  const datiVeicolo = {
    id_veicolo: "11001",
    marca: "CITROEN",
    modello: "Jumpy",
    descr_colore: "Kaolin White",
    descr_ubicazione: "SEDE DALMA PRINCIPALE",
    telaio: "VF7VBYHVMNZ063872",
    targa: "GT434FD",
    alimentazione: "Diesel",
    tipo_cambio: "Manuale",
    status_veicolo_desc: "In Stock"
  };

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleConfirm = (data) => {
    console.log("Dati confermati:", data);
    // Qui invia la richiesta POST per confermare l'auto
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex">
      {/* Colonna sinistra: 50% della larghezza */}
      <div className="w-1/2 p-6">
        <LeftPanel datiVeicolo={datiVeicolo} onConfirm={handleConfirm} />
      </div>
      {/* Colonna destra: 50% della larghezza */}
      <div className="w-1/2 p-6">
        <RightPanel refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
