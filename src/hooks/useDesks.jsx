import { baseUrlTicket, getRequest } from "@/lib/service";
import { useEffect, useState } from "react";

export const useDesks = (socket) => {
    const [desks, setDesks] = useState([]);
    const [desksLoading, setDesksLoading] = useState(false);

    //* ===> Gestione realtime del cambiamento di stato dei desk
    useEffect(() => {
        const handleEditDesk = (editedDesk) => {
            setDesks((prev) => {
                return prev.map((ticket) => {
                    if (ticket?.id === editedDesk?.id) {
                        return editedDesk;
                    } else {
                        return ticket;
                    }
                });
            });
        };

        socket?.on("deskOnline", handleEditDesk);
        return () => {
            socket?.off("deskOnline", handleEditDesk);
        };
    }, [socket]);

    //* ===> Recupera tutti i desk
    useEffect(() => {
        const getDesk = async () => {
            try {
                setDesksLoading(true);
                const response = await getRequest(
                    `${baseUrlTicket}/desks/all?api_key=${
                        import.meta.env.VITE_API_KEY_TICKET
                    }`
                );
                setDesksLoading(false);
                setDesks(response);
            } catch (error) {
                console.error("Errore nel recupero dei desk online:", error);
            }
        };

        getDesk();
    }, []);

    return {
        desks,
        desksLoading,
    };
};
