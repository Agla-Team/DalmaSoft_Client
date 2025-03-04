// Recupera l'URL del backend dalla variabile d'ambiente
const backUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Cerca un veicolo per numero di telaio
 * @param {string} telaio - Numero di telaio (anche parziale)
 * @returns {Promise<Array>} - Array di veicoli trovati
 */
export const searchTelaioAuto = async (telaio) => {
  if (!telaio || telaio.trim().length < 5) {
    return [];
  }

  try {
    const res = await fetch(
      `${backUrl}/api/inventario/search/telaio?query=${encodeURIComponent(telaio)}`
    );
    if (!res.ok) {
      throw new Error(`Errore API: ${res.status}`);
    }
    const data = await res.json();
    console.log("Risultati ricerca per telaio:", data);
    return data;
    
  } catch (error) {
    console.error("Errore nella ricerca per telaio:", error);
    return [];
  }
};

/**
 * Cerca un veicolo per targa
 * @param {string} targa - Numero di targa (con o senza spazi)
 * @returns {Promise<Array>} - Array di veicoli trovati
 */
export const searchTargaAuto = async (targa) => {
  if (!targa || targa.trim().length < 3) {
    return [];
  }

  try {
    // Rimuove eventuali spazi
    const searchTarga = targa.replace(/\s+/g, "");
    const res = await fetch(
      `${backUrl}/api/inventario/search/targa?targa=${encodeURIComponent(searchTarga)}`
    );
    if (!res.ok) {
      throw new Error(`Errore API: ${res.status}`);
    }
    const data = await res.json();
    console.log("Risultati ricerca per targa:", data);
    return data;
  } catch (error) {
    console.error("Errore nella ricerca per targa:", error);
    return [];
  }
};

/**
 * Ricerca generica veicolo (targa o telaio)
 * Se il tipo è "auto", la funzione combina i risultati ottenuti dalla ricerca per telaio e per targa.
 * @param {string} query - Query di ricerca (telaio o targa)
 * @param {string} type - Tipo di ricerca ('telaio', 'targa' o 'auto')
 * @returns {Promise<Array>} - Array di veicoli trovati
 */
export const searchVehicle = async (query, type = "auto") => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    // Se si specifica "auto", combino i risultati sia della ricerca per telaio che per targa
    if (type.toLowerCase() === "auto") {
      const [resultsTelaio, resultsTarga] = await Promise.all([
        fetch(
          `${backUrl}/api/inventario/search/telaio?query=${encodeURIComponent(query)}`
        ),
        fetch(
          `${backUrl}/api/inventario/search/targa?query=${encodeURIComponent(
            query.replace(/\s+/g, "")
          )}`
        ),
      ]);
      if (!resultsTelaio.ok || !resultsTarga.ok) {
        throw new Error(`Errore API durante la ricerca auto`);
      }
      const [dataTelaio, dataTarga] = await Promise.all([
        resultsTelaio.json(),
        resultsTarga.json(),
      ]);
      // Unisco i risultati
      return [...dataTelaio, ...dataTarga];
    } else {
      // Altrimenti, uso il tipo specificato
      let endpoint = type.toLowerCase();
      // Se è targa, rimuovo eventuali spazi
      if (endpoint === "targa") {
        query = query.replace(/\s+/g, "");
      }
      const res = await fetch(
        `${backUrl}/api/inventario/search/${endpoint}?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) {
        throw new Error(`Errore API: ${res.status}`);
      }
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error(`Errore nella ricerca veicolo (${type}):`, error);
    return [];
  }
};

export default {
  searchTelaioAuto,
  searchTargaAuto,
  searchVehicle,
};
