import { useState, useEffect } from "react";

export function usePolling(url, intervalTime = 900000) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Errore HTTP: ${response.status}`);
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err);
                console.error("Errore nel fetch dei dati:", err);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, intervalTime);

        return () => clearInterval(intervalId);
    }, [url, intervalTime]);

    return { data, error };
}
