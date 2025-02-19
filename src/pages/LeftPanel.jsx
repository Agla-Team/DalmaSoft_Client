import React, { useState } from "react";
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

export default function LeftPanel({ onConfirm, onTelaioChange }) {
  // Stato per l'input e i dati
  const [telaio, setTelaio] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [note, setNote] = useState("");
  const [condizione, setCondizione] = useState("Nuovo");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Stati per il dialogo di conferma
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Variabile per l'URL backend (o backUrl se l'hai definito altrove)
  const backUrl = import.meta.env.VITE_BACKEND_URL;
  const frontUrl = import.meta.env.VITE_FRONT_URL;

  // Funzione per resettare il form dopo la conferma
  const resetForm = () => {
    setTelaio("");
    setSelectedCar(null);
    setNote("");
    setCondizione("Nuovo");
    setQuery("");
    setResults([]);
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
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Inserisci Telaio</CardTitle>
        </CardHeader>
        <CardContent>
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
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          {loading && <p className="text-sm text-gray-500 mt-2">Ricerca in corso...</p>}
          {results.length > 0 && (
            <div className="mt-4 border rounded p-2 max-h-64 overflow-y-auto">
              {results.map((car) => (
                <div
                  key={car.telaio}
                  onClick={() => handleSelectCar(car)}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  <p className="text-sm">
                    <strong className="color-gray-100">{car.telaio}</strong> - <strong>Brand: </strong>{car.marca} <strong>Modello: </strong>{car.modello} <strong>Colore: </strong>{car.descr_colore}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card 2: Riepilogo Dati Veicolo (solo se un veicolo è stato selezionato) */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Riepilogo Dati Veicolo</CardTitle>
        </CardHeader>
        <CardContent>
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

      {/* Card 3: Note e Condizione */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Note e Condizione</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <Textarea
              id="note"
              placeholder="Inserisci eventuali note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="condizione" className="block text-sm font-medium text-gray-700 mb-1">
              Condizione
            </label>
            <select
              id="condizione"
              value={condizione}
              onChange={(e) => setCondizione(e.target.value)}
              className="w-full border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Nuovo">Nuovo</option>
              <option value="Assegnato">Assegnato</option>
              <option value="Venduto">Venduto</option>
            </select>
          </div>
          <Button onClick={handleConfirm} className="w-full bg-blue-500 text-white hover:bg-blue-600">
            Conferma Auto
          </Button>
        </CardContent>
        </Card>

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
