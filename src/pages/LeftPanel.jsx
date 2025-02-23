import React, { useEffect, useState} from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog";

// Variabile per l'URL backend (o backUrl se l'hai definito altrove)
const backUrl = import.meta.env.VITE_BACKEND_URL;
const frontUrl = import.meta.env.VITE_FRONT_URL;

export default function LeftPanel({ onConfirm, onTelaioChange, refreshTrigger }) {
  // Stato per l'input e i dati
  const [telaio, setTelaio] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [note, setNote] = useState("");
  const [condizione, setCondizione] = useState("Nuovo");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const [validRecords, setValidRecords] = useState([]);
  const [incompleteRecords, setIncompleteRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Stati locali: building e location (area)
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Stati per i conteggi e i brand
  const [counts, setCounts] = useState({ inStock: 0, inventariate: 0 });
  const [brands, setBrands] = useState([]);

  // Stati per il dialogo di conferma
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  

  // Funzione per resettare il form dopo la conferma
  const resetForm = () => {
    setTelaio("");
    setSelectedCar(null);
    setNote("");
    setCondizione("Nuovo");
    setQuery("");
    setResults([]);
  };

  useEffect(() => {
      async function fetchCounts() {
        try {
          const res = await fetch(`${backUrl}/api/inventario/counts`);
          const data = await res.json();
          setCounts(data);
        } catch (error) {
          console.error("Errore nel recupero dei conteggi:", error);
        }
      }
  
      async function fetchBrands() {
        try {
          const res = await fetch(`${backUrl}/api/inventario/brands`);
          const data = await res.json();
          setBrands(data);
        } catch (error) {
          console.error("Errore nel recupero dei brand:", error);
        }
      }
  
      fetchCounts();
      fetchBrands();
    }, [refreshTrigger]);

  // Oggetto che mappa ogni building a un array di opzioni/aree
  const buildings = {
    "Dalma Via Varese 175": ["Deposito Dalma"],
    "Dalma Via Varese 175B": [
      "Showroom Peugeot",
      "Showroom Citroën",
      "Showroom DS",
      "Showroom 3° Piano",
      "Accettazione Service",
    ],
    "Via Donizzetti 3": [
      "Showroom Dr Vetrine",
      "Showroom Evo 2° Piano",
      "Esposizione Vetture Usate Piano Terra",
      "Esposizione Vetture Usate 2° Piano",
    ],
    "Via Donizzetti 6": [
      "Showroom Evo",
      "Esposizione Veicoli Commerciali Peugeot",
      "Esposizione Veicoli Commerciali Citroën",
      "Esposizione Veicoli Commerciali Maxus",
      "Esposizione Showroom Focaccia",
    ],
  };

  // Opzioni building
  const buildingOptions = Object.keys(buildings);

  // Opzioni location dipendenti dal building selezionato
  const locationOptions = selectedBuilding
    ? buildings[selectedBuilding]
    : [];  

  // Funzione per gestire cambio building
  const handleBuildingChange = (e) => {
    const newBuilding = e.target.value;
    setSelectedBuilding(newBuilding);
    // Resetto la seconda select
    setSelectedLocation("");
  };

  // Funzione di ricerca: viene chiamata quando l'utente digita
  const searchCar = async (value) => {
    setQuery(value);
    if (value.length > 4) {
      setLoading(true);
      try {
        // Chiamata all'endpoint di ricerca
        const res = await fetch(`${backUrl}/api/inventario/search?query=${encodeURIComponent(value)}`);
        if (!res.ok) throw new Error(`Errore API: ${res.status}`);
        const data = await res.json();
        console.log("Risultati ricevuti:", data);
        setResults(data);
      } catch (error) {
        console.error("Errore nella ricerca auto:", error);
      }
      setLoading(false);
    } else {
      setResults([]);
    }
  };

  // Gestione della selezione del veicolo dalla lista dei risultati
  const handleSelectCar = (car) => {
    setSelectedCar(car);
    // Imposta il campo telaio in base al veicolo selezionato
    setTelaio(car.telaio);
    // Puoi anche invocare onTelaioChange se necessario
    if (onTelaioChange) onTelaioChange(car.telaio);
    // Opzionalmente, svuota i risultati
    setResults([]);
  };

  // Funzione per confermare l'auto: invia i dati al backend
  const handleConfirm = async () => {
    if (!selectedCar) {
      alert("Seleziona un veicolo dalla lista dei risultati.");
      return;
    }
    try {
      const payload = {
        ...selectedCar,
        note,
        condizione, // Il valore scelto dalla select (default "Nuovo")
        building: selectedBuilding,
        area: selectedLocation,
      };

      const response = await fetch(`${backUrl}/api/inventario/conferma`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        // Se l'auto è già inventariata, il backend potrebbe rispondere con un messaggio specifico
        const errorData = await response.json();
        throw new Error(errorData.message || `Errore durante la conferma: ${response.status}`);
      }
      const result = await response.json();
      setAlertMessage(result.message || "Auto confermata con successo!");
    } catch (error) {
      setAlertMessage(error.message || "Errore interno del server");
    } finally {
      // Apri l'Alert Dialog
      setAlertOpen(true);
    }
  };  

  return (
    <div className="flex flex-col space-y-6">
      {/* Card 1: Inserimento Telaio e Visualizzazione dei Risultati */}
      <div className="flex flex-row space-x-4 items-start">
      <Card className="w-7/12 border border-red-700 rounded-md h-50">
          <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
            <CardTitle className="text-sm text-white font-light">Inserisci Telaio</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Input
              type="text"
              placeholder="Inserisci il numero di telaio..."
              value={telaio}
              onChange={(e) => {
                const value = e.target.value;
                setTelaio(value);
                // Invia la query per la ricerca
                searchCar(value);
              }}
              className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            {loading && <p className="text-sm text-gray-500 mt-2">Ricerca in corso...</p>}
            {results.length > 0 && (
              <div className="mt-4 border rounded p-2 max-h-64 overflow-y-auto">
                {results.map((car) => (
                  <div
                    key={car.telaio}
                    onClick={() => handleSelectCar(car)}
                    className="cursor-pointer bg-yellow-500 hover:bg-gray-100 p-2 rounded"
                  >
                    <div className="table w-full">
                      <div className="table-row">
                        <div className="table-cell w-[29%] align-top">
                          <span className="text-sm">Telaio: </span>
                          <strong className="text-slate-800 text-sm"> {car.telaio} </strong>
                        </div>
                        <div className="table-cell w-[21%] align-top">
                          <span className="text-sm">Brand: </span>
                          <strong className="text-slate-800"> {car.marca} </strong>
                        </div>
                        <div className="table-cell w-[29%] align-top">
                          <span className="text-sm">Modello: </span>
                          <strong className="text-slate-800"> {car.modello} </strong>
                        </div>
                        <div className="table-cell w-[21%] align-top">
                          <span className="text-sm">Colore: </span>
                          <strong className="text-slate-800"> {car.descr_colore} </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
      </Card>

      <Card className="w-1/6 border border-slate-700 rounded-md h-50">
          <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
            <CardTitle className="text-sm text-white font-light">Nuove In Stock</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-gray-700">
              <strong>Infinity:</strong> {counts.inStock}
            </p>
            <p className="text-gray-700">
              <strong>Inventariate:</strong> {counts.inventariate}
            </p>
          </CardContent>
      </Card>

      <Card className="w-1/4 border border-slate-700 rounded-md h-50">
        <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
          <CardTitle className="text-sm text-white font-light">
            Brand Inventariati
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {brands.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
              {brands.map((b, index) => (
                <p key={index} className="text-gray-700">
                  <strong>{b.marca}:</strong>{" "}
                  {b.count || b.dataValues?.count || 0}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nessun dato disponibile.</p>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Card 2: Riepilogo Dati Veicolo (solo se un veicolo è stato selezionato) */}
      <div className="flex flex-row space-x-4">
      <Card className=" flex-1 border border-slate-700 rounded-md">
        <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
          <CardTitle className="text-sm text-white font-light">
            Dati Veicolo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {selectedCar ? (
            <div className="space-y-2 text-gray-700">
              <div><strong>Marca:</strong> {selectedCar.marca}</div>
              <div><strong>Modello:</strong> {selectedCar.modello}</div>
              <div><strong>Colore:</strong> {selectedCar.descr_colore}</div>
              <div><strong>Ubicazione:</strong> {selectedCar.descr_ubicazione}</div>
              <div><strong>Telaio:</strong> {selectedCar.telaio}</div>
              <div><strong>Targa:</strong> {selectedCar.targa}</div>
              <div><strong>Alimentazione:</strong> {selectedCar.alimentazione}</div>
              <div><strong>Tipo Cambio:</strong> {selectedCar.tipo_cambio}</div>
              <div><strong>Status:</strong> {selectedCar.status_veicolo_desc}</div>
            </div>
          ) : (
            <p className="text-gray-500">Nessun veicolo selezionato.</p>
          )}
        </CardContent>
      </Card>

      <Card className=" flex-1 border border-slate-700 rounded-md">
        <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
          <CardTitle className="text-sm text-white font-light">
            Conferma Veicolo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">

          <div className="mb-4">
            <label 
              htmlFor="condizione" 
              className="block text-sm font-medium mb-1"
            >
              Condizione
            </label>
            <select
              id="condizione"
              value={condizione}
              onChange={(e) => setCondizione(e.target.value)}
              className="w-full border border-gray-300 focus:border-red-500 focus:ring-red-500 rounded p-2"
            >
              <option value="In_Stock">In Stock</option>
              <option value="Venduto">Venduto</option>
            </select>
          </div>

          <div className="mb-4 flex gap-4">

            {/* Select Building */}
            <div className="flex-1">
              <label
                htmlFor="buildingSelect"
                className="block text-sm font-medium mb-1"
              >
                Building
              </label>
              <select
                id="buildingSelect"
                value={selectedBuilding}
                onChange={handleBuildingChange}
                className="w-full border border-gray-300 focus:border-red-500 focus:ring-red-500 rounded p-2"
              >
                <option value="" disabled>
                  Seleziona un building
                </option>
                {buildingOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Location */}
            <div className="flex-1">
              <label
                htmlFor="locationSelect"
                className="block text-sm font-medium mb-1"
              >
                Area / Location
              </label>
              <select
                id="locationSelect"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full border border-gray-300 focus:border-red-500 focus:ring-red-500 rounded p-2"
                disabled={!selectedBuilding}
              >
                <option value="" disabled>
                  {selectedBuilding
                    ? "Seleziona un'area"
                    : "Prima seleziona il building"}
                </option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <Textarea
              id="note"
              placeholder="Inserisci eventuali note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <Button onClick={handleConfirm} className="w-full bg-amber-500 text-gray-900 hover:bg-amber-600 pt-2">
            Conferma Auto
          </Button>
        </CardContent>
      </Card>
      </div>
      
      {/* Alert Dialog per mostrare il messaggio di conferma */}
        <AlertDialog open={alertOpen} onOpenChange={(open) => {
            // Quando il dialogo si chiude, resetta il form
            if (!open) {
            setAlertOpen(false);
            resetForm();
            }
        }}>
        <AlertDialogContent className="bg-white shadow-lg p-6 rounded border">
            <AlertDialogTitle className="text-xl font-bold text-gray-800">Conferma</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 mt-2">
                {alertMessage}
            </AlertDialogDescription>
            <AlertDialogAction 
                onClick={() => setAlertOpen(false)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                OK
            </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
        </div>
        );
}
