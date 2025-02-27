import { useState, useEffect } from 'react';

export const useTickets = () => {
    const [tickets, setTickets] = useState([]);



    useEffect(() => {
        const fetchTickets = async () => {
            const response = await fetch("https://screen.dalmaweb.it/api/tickets?api_key=c0019162439910429df65e809aca9c2a");
            const data = await response.json();
            setTickets(data);
        };

        fetchTickets();
    }, []);


    return {
        tickets
    }
}