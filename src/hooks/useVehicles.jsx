import { createContext,  useState } from "react";

const backUrl = import.meta.env.VITE_BACKEND_URL;

export const VehiclesContext = createContext(null);

export const VehiclesContextProvider = ({ children }) => {
    const [vehicleByEntity, setVehicleByEntity] = useState(null);
    const [vehicleByEntityLoading, setVehicleByEntityLoading] = useState(false);
    const [allVehicleByEntity, setAllVehicleByEntity] = useState([]);

    const getVehicleFromEntity = async (entityType, entity) => {
        
        try {
            setVehicleByEntityLoading(true);
            const res = await fetch(
                `${backUrl}/api/inventario/search/${entityType}?query=${encodeURIComponent(entity)}`
              );
              if (!res.ok) {
                throw new Error(`Errore API: ${res.status}`);
              }
              const data = await res.json();
              
              setVehicleByEntity(data);
                setVehicleByEntityLoading(false);
                if (entityType==='telaio') {
                    setAllVehicleByEntity([])
                }
        } catch (error) {
            console.log(error);
        }
    }

    const getAllVehicleFromEntity = async (entity) => {
        
        try {
            
            const res = await fetch(
                `${backUrl}/api/inventario/search/telaioAll?query=${encodeURIComponent(entity)}`
              );
              if (!res.ok) {
                throw new Error(`Errore API: ${res.status}`);
              }
              const data = await res.json();
              
              setAllVehicleByEntity(data);
        } catch (error) {
            console.log(error);
        }
    }


    return <VehiclesContext.Provider value={{ vehicleByEntity, vehicleByEntityLoading, getVehicleFromEntity, getAllVehicleFromEntity, allVehicleByEntity }}>
    {children}
  </VehiclesContext.Provider>
    

}