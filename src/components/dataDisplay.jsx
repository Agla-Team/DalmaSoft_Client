// src/components/DataDisplay.jsx
import React from 'react';
import { usePolling } from '../hooks/usePolling'; // Regola il percorso in base alla tua struttura
const backUrl = import.meta.env.VITE_BACKEND_URL;

function DataDisplay() {
  const { data, error } = usePolling(`${backUrl}/api/auto/autogest`, 900000); // Intervallo di 15 minuti

  if (error) {
    return <p>Si è verificato un errore: {error.message}</p>;
  }

  return (
    <div>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Caricamento dati...</p>
      )}
    </div>
  );
}

export default DataDisplay;
