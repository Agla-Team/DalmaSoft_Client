/* eslint-disable react/prop-types */
import { createContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const socket = useMemo(() => {
        const newSocket = io(import.meta.env.VITE_SOCKET_BACK, {
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        return newSocket;
    }, []);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
