// Recupera l'URL del backend dalla variabile d'ambiente
const backUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Cerca un veicolo per numero di telaio
 * @param {string} telaioParziale - Numero di telaio (anche parziale)
 * @returns {Promise<Array>} - Array di veicoli trovati
 */
export const searchTelaioAutoNew = async (telaioParziale) => {
  if (!telaioParziale || telaioParziale.length < 5) {
    return [];
  }

  try {
    const res = await fetch(`${backUrl}/api/inventario/searchNewTelaio?query=${encodeURIComponent(telaioParziale)}`);
    if (!res.ok) {
      throw new Error(`Errore API: ${res.status}`);
    }
    const data = await res.json();
    console.log("Risultati ricerca per telaio:", data);
    return data;
  } catch (error) {
    console.error("Errore nella ricerca veicolo per telaio:", error);
    return [];
  }
};

/**
 * Cerca un veicolo per targa
 * @param {string} targa - Numero di targa (con o senza spazi)
 * @returns {Promise<Array>} - Array di veicoli trovati
 */
export const searchTargaAutoNew = async (targa) => {
  if (!targa || targa.trim().length < 3) {
    return [];
  }

  try {
    // Rimuovi spazi per la ricerca
    const searchTarga = targa.replace(/\s+/g, '');
    
    const res = await fetch(`${backUrl}/api/inventario/searchNewTarga?query=${encodeURIComponent(searchTarga)}`);
    if (!res.ok) {
      throw new Error(`Errore API: ${res.status}`);
    }
    const data = await res.json();
    console.log("Risultati ricerca per targa:", data);
    return data;
  } catch (error) {
    console.error("Errore nella ricerca veicolo per targa:", error);
    return [];
  }
};

/**
 * Ricerca generica veicolo (targa o telaio)
 * @param {string} query - Query di ricerca (telaio o targa)
 * @param {string} type - Tipo di ricerca ('telaio', 'targa', o 'auto')
 * @returns {Promise<Array>} - Array di veicoli trovati
 */
export const searchVehicle = async (query, type = 'auto') => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    let endpoint;
    
    // Determina l'endpoint corretto in base al tipo
    switch (type.toLowerCase()) {
      case 'telaio':
        endpoint = 'searchNewTelaio';
        break;
      case 'targa':
        endpoint = 'searchNewTarga';
        // Rimuovi spazi per la ricerca targa
        query = query.replace(/\s+/g, '');
        break;
      default:
        // Tipo 'auto' cerca in entrambi
        endpoint = 'search';
    }
    
    const res = await fetch(`${backUrl}/api/inventario/${endpoint}?query=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error(`Errore API: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Errore nella ricerca veicolo (${type}):`, error);
    return [];
  }
};

export default {
  searchTelaioAutoNew,
  searchTargaAutoNew,
  searchVehicle
};