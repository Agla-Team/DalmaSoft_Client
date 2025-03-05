import React, { useContext, useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LicensePlateReader from "../components/read-plate";
import { searchTelaioAuto } from "../utils/vehicleSearch"; // Importa la funzione di utilità
import { VehiclesContext } from "@/hooks/useVehicles";

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
  const [tipologia, setTipologia] = useState("Normale");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const debounceTimerRef = useRef(null);
  const [localResults, setLocalResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { 
    getVehicleFromEntity, 
    vehicleByEntity, 
    getAllVehicleFromEntity, 
    allVehicleByEntity,
    vehicleByEntityLoading 
  } = useContext(VehiclesContext);
 
  console.log('da front: ', allVehicleByEntity)

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
    setTipologia("Normale");
    setQuery("");
    setResults([]);
    setSelectedBuilding("");
    setSelectedLocation("");
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
    "Dalma Via Donizzetti 3": [
      "Showroom Dr Vetrine",
      "Showroom Evo 2° Piano",
      "Esposizione Vetture Usate Piano Terra",
      "Esposizione Vetture Usate 2° Piano",
    ],
    "Dalma Via Donizzetti 6": [
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

  // Funzione di ricerca: viene chiamata quando l'utente digita nel campo telaio
  

  // Gestione della selezione del veicolo dalla lista dei risultati
  const handleChange = (e) => {
    const newentity = e.target.value;
    setTelaio(newentity);
    getAllVehicleFromEntity(newentity);
  };

  // Funzione per confermare l'auto: invia i dati al backend
  const handleConfirm = async () => {
    if (!vehicleByEntity) {
      alert("Seleziona un veicolo dalla lista dei risultati.");
      return;
    }

    if (!condizione || !tipologia || !selectedBuilding || !selectedLocation) {
      alert("Non hai inserito tutti i campi richiesti!");
      return;
    }

    try {
      const payload = {
        ...vehicleByEntity,
        note,
        condizione, // Il valore scelto dalla select (default "Nuovo")
        tipologia,
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

      // Resetta il form dopo la conferma
      resetForm();

    } catch (error) {
      setAlertMessage(error.message || "Errore interno del server");
    } finally {
      // Apri l'Alert Dialog
      setAlertOpen(true);
    }
  };

  // Funzione per gestire la selezione di un veicolo dalla targa
  const handlePlateConfirm = (car) => {
    console.log("Veicolo trovato tramite targa:", car);
    
    // Imposta il veicolo selezionato
    setSelectedCar(car);
    
    // Imposta anche il campo telaio
    setTelaio(car.telaio);
    
    // Puoi anche invocare onTelaioChange se necessario
    if (onTelaioChange) onTelaioChange(car.telaio);
  };

  return (
    <div className="p-6 w-full max-w-screen-2xl mx-auto">
      {/* Card 1: Inserimento Telaio */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="rounded-2xl border border-gray-200 bg-white md:col-span-2">
            <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
              <CardTitle className="text-sm text-white font-light">Inserisci Telaio</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <Input
                type="text"
                placeholder="Inserisci il numero di telaio..."
                value={telaio}
                onChange={handleChange}
                className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
                <div className="mt-4 border rounded p-2 max-h-64 overflow-y-auto">
                  {allVehicleByEntity.map((car) => (
                    <div
                      key={car.id}
                      onClick={() => {
                        setTelaio('')
                        getVehicleFromEntity('telaio', car.telaio)
                      }}
                      className="cursor-pointer bg-yellow-500 hover:bg-gray-100 p-2 rounded mb-2"
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
             
            </CardContent>
          </Card>

          {/* Card 2: Acquisizione Targa */}
          <Card className="rounded-2xl border border-gray-200 bg-white md:col-span-1">
            <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
              <CardTitle className="text-sm text-white font-light">Acquisisci Targa</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <LicensePlateReader onReset={resetForm} onPlateConfirm={handlePlateConfirm} />
            </CardContent>
          </Card>
        </div>

      {/* Card 3: Riepilogo Dati Veicolo */}
      <div className="mb-6">
        
        <Card className="w-full border border-slate-700 rounded-t">
        <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
          <CardTitle className="text-sm text-white font-light">
            Dati Veicolo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {vehicleByEntity ? (
            <div className="space-y-2 text-gray-700">
              <div><strong>Marca:</strong> {vehicleByEntity.marca}</div>
              <div><strong>Modello:</strong> {vehicleByEntity.modello}</div>
              <div><strong>Colore:</strong> {vehicleByEntity.descr_colore}</div>
              <div><strong>Ubicazione:</strong> {vehicleByEntity.descr_ubicazione}</div>
              <div><strong>Telaio:</strong> {vehicleByEntity.telaio}</div>
              <div><strong>Targa:</strong> {vehicleByEntity.targa}</div>
              <div><strong>Alimentazione:</strong> {vehicleByEntity.alimentazione}</div>
              <div><strong>Tipo Cambio:</strong> {vehicleByEntity.tipo_cambio}</div>
              <div><strong>Status:</strong> {vehicleByEntity.status_veicolo_desc}</div>
            </div>
          ) : (
            <p className="text-gray-500">Nessun veicolo selezionato.</p>
          )}
        </CardContent>
      </Card>

      </div>

      {/* Card 4: Conferma Veicolo */}
      <div className="mb-6">
      <Card className="w-full border border-slate-700 rounded-t">
        <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
          <CardTitle className="text-sm text-white font-light">
            Conferma Veicolo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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
              <option value="Nuovo">Auto Nuova</option>
              <option value="Usato">Auto Usata</option>
            </select>
          </div>

          <div>
            <label 
              htmlFor="tipologia" 
              className="block text-sm font-medium mb-1"
            >
              Tipologia
            </label>
            <select
              id="tipologia"
              value={tipologia}
              onChange={(e) => setTipologia(e.target.value)}
              className="w-full border border-gray-300 focus:border-red-500 focus:ring-red-500 rounded p-2"
            >
              <option value="Normale">Normale</option>
              <option value="Commerciale">Commerciale</option>
              <option value="Km0">Km 0</option>
              <option value="Km0">Non Vendibile</option>
            </select>
          </div>
        </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            {/* Select Building */}
            <div>
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
            <div>
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
              className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white text-gray-900"
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