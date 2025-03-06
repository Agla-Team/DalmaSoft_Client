import { baseUrlTicket, getRequest, postRequest } from "@/lib/service";
import { useCallback, useEffect, useState } from "react";

export const useDesks = (socket) => {
    const [desks, setDesks] = useState([]);
    const [desksLoading, setDesksLoading] = useState(false);

    //* ===> Funzione per cambiare lo stato di un desk
    const turnOffDesk = useCallback(async (deskId) => {
        try {
            const response = await postRequest(
                `${baseUrlTicket}/desks/remote?api_key=${
                    import.meta.env.VITE_API_KEY_TICKET
                }`,
                JSON.stringify({ deskId })
            );

            if (response.error) {
                console.log(response.message.error);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

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
        turnOffDesk,
    };
};
