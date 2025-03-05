import { baseUrlTicket, getRequest } from "@/lib/service";
import { useState, useEffect } from "react";

export const useTickets = (socket) => {
    const [tickets, setTickets] = useState([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);
    const [lastCalledTicket, setLastCalledTicket] = useState(null);

    //* ===> Gestione realtime dei nuovi ticket creati
    useEffect(() => {
        const handleCreatedTicket = (newticket) => {
            setTickets((prev) => {
                return [...prev, newticket];
            });
        };

        socket?.on("createdTicket", handleCreatedTicket);
        return () => {
            socket?.off("createdTicket", handleCreatedTicket);
        };
    }, [socket]);

    //* ===> Gestione realtime dell'aggiornamento dello stato di un determinato ticket e dell'aggiornamento dell'ultimo ticket chiamato
    useEffect(() => {
        const handleEditTicket = (editedTicket) => {
            setTickets((prev) => {
                return prev.map((ticket) => {
                    if (ticket?.id === editedTicket?.id) {
                        return editedTicket;
                    } else {
                        return ticket;
                    }
                });
            });

            if (editedTicket.status === "waiting") {
                setLastCalledTicket(editedTicket);
            }
        };

        socket?.on("editedTicket", handleEditTicket);
        return () => {
            socket?.off("editedTicket", handleEditTicket);
        };
    }, [socket]);

    //* ===> Recupera tutti i tickets del giorno
    useEffect(() => {
        const getTickets = async () => {
            try {
                setTicketsLoading(true);
                const response = await getRequest(
                    `${baseUrlTicket}/tickets?api_key=${
                        import.meta.env.VITE_API_KEY_TICKET
                    }`
                );

                setTicketsLoading(false);
                setTickets(response);
            } catch (error) {
                console.log(error);
            }
        };

        getTickets();
    }, []);

    return {
        tickets,
        ticketsLoading,
        lastCalledTicket,
    };
};
