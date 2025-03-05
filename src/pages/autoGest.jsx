import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "@/lib/service";
import VehiclesDetailsCard from "@/components/VehiclesDetailsCard";
import VehiclesXBrandSummary from "@/components/VehiclesXBrandSummary";

export default function AutoGest() {
    const [data, setData] = useState({
        parcoAuto: { count: 0, valore: 0 },
        autoNuove: { count: 0, valore: 0 },
        autoUsate: { count: 0, valore: 0 },
        autoVirtuali: { count: 0, valore: 0 },
        autoAssegnate: { count: 0, valore: 0 },
        dettagliPerBrand: {},
        brands: [],
    });

    const getAutoData = async () => {
        try {
            const response = await getRequest(
                `${baseUrl}/api/auto/autogest`,
                localStorage.getItem("token")
            );

            setData({
                parcoAuto: {
                    count: response.totaleInStock,
                    valore: response.valoreParcoAuto,
                },
                autoNuove: {
                    count: response.dettaglio.autoNuove.inStock,
                    valore: response.dettaglio.autoNuove.valore,
                },
                autoUsate: {
                    count: response.dettaglio.autoUsate.inStock,
                    valore: response.dettaglio.autoUsate.valore,
                },
                autoVirtuali: {
                    count: response.dettaglio.autoNuove.virtuali,
                    valore: response.dettaglio.autoNuove.valoreVirtuali,
                },
                autoAssegnate: {
                    count: response.totaleAssegnate,
                    valore: response.valoreAssegnate,
                },
                dettagliPerBrand: response.dettagliPerBrand || {},
                brands: response.brands || [],
            });
        } catch (error) {
            console.error("Errore nel caricamento dati:", error);
        }
    };

    useEffect(() => {
        getAutoData();
        const interval = setInterval(getAutoData, 900000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <VehiclesDetailsCard
                    title="Auto In Stock"
                    count={data.parcoAuto.count}
                    value={data.parcoAuto.valore.toLocaleString()}
                />

                <VehiclesDetailsCard
                    title="Nuove In Stock"
                    count={data.autoNuove.count}
                    value={data.autoNuove.valore.toLocaleString()}
                />

                <VehiclesDetailsCard
                    title="Usate In Stock"
                    count={data.autoUsate.count}
                    value={data.autoUsate.valore.toLocaleString()}
                />

                <VehiclesDetailsCard
                    title="Virtuali"
                    count={data.autoVirtuali.count}
                    value={data.autoVirtuali.valore.toLocaleString()}
                />

                <VehiclesDetailsCard
                    title="Assegnate"
                    count={data.autoAssegnate.count}
                    value={data.autoAssegnate.valore.toLocaleString()}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.dettagliPerBrand &&
                    Object.keys(data.dettagliPerBrand).length > 0 ? (
                    Object.entries(data.dettagliPerBrand).map(
                        ([brand, details]) => (
                            <VehiclesXBrandSummary brand={brand} details={details} key={brand} />
                        )
                    )
                ) : (
                    <p className="text-gray-300">
                        Loading...
                    </p>
                )}
            </div>
        </div>
    );
}
