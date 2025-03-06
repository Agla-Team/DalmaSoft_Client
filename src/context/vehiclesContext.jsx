/* eslint-disable react/prop-types */
import { getRequest, postRequest } from "@/lib/service";
import { createContext, useState } from "react";

const backUrl = import.meta.env.VITE_BACKEND_URL;

export const VehiclesContext = createContext(null);

export const VehiclesContextProvider = ({ children }) => {
    const [ownedVehicleDataSummary, setOwnedVehicleDataSummary] = useState([]);

    const [vehicleByEntity, setVehicleByEntity] = useState(null);
    const [vehicleByEntityLoading, setVehicleByEntityLoading] = useState(false);
    const [allVehicleByEntity, setAllVehicleByEntity] = useState([]);

    const getOwnedVehicleDataSummary = async () => {
        try {
            const response = await getRequest(
                `${backUrl}/api/auto/autogest`,
                localStorage.getItem("token")
            );
            console.log(response);

            setOwnedVehicleDataSummary(response);
        } catch (error) {
            console.log(error);
        }
    };

    //* ===> Recupera un veicolo in base ad un'entità (targa, telaio, ecc...)
    const getVehicleFromEntity = async (entityType, entity) => {
        try {
            setVehicleByEntityLoading(true);
            const response = await getRequest(
                `${backUrl}/api/inventario/search/${entityType}?query=${encodeURIComponent(
                    entity
                )}`
            );

            setVehicleByEntity(response);
            setVehicleByEntityLoading(false);
            if (entityType === "telaio") {
                setAllVehicleByEntity([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //* ===> Recupera più veicoli in base ad un'entità (targa, telaio, ecc...)
    const getAllVehicleFromEntity = async (entity) => {
        if (!entity || entity.trim() === "") {
            setAllVehicleByEntity([]);
            return;
        }
        try {
            const response = await getRequest(
                `${backUrl}/api/inventario/search/telaioAll?query=${encodeURIComponent(
                    entity
                )}`
            );

            setAllVehicleByEntity([...response]);
        } catch (error) {
            console.log(error);
        }
    };

    //* ===> Aggiunge un veicolo all'inventario
    const addVehicleToInvetory = async (payload) => {
        try {
            const response = await postRequest(
                `${backUrl}/api/inventario/conferma`,
                JSON.stringify(payload)
            );
            setVehicleByEntity(null);
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <VehiclesContext.Provider
            value={{
                getOwnedVehicleDataSummary,
                ownedVehicleDataSummary,

                vehicleByEntity,
                vehicleByEntityLoading,
                getVehicleFromEntity,
                getAllVehicleFromEntity,
                allVehicleByEntity,
                addVehicleToInvetory,
            }}
        >
            {children}
        </VehiclesContext.Provider>
    );
};
