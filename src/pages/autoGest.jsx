import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl, getRequest } from "@/lib/service";
import VehiclesDetailsCard from "@/components/VehiclesDetailsCard";

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

            {/* Schede per ogni brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.dettagliPerBrand &&
                Object.keys(data.dettagliPerBrand).length > 0 ? (
                    Object.entries(data.dettagliPerBrand).map(
                        ([brand, details]) => (
                            <Card key={brand} className="shadow-none border">
                                <CardHeader className="flex items-center">
                                    <img
                                        src={
                                            details.logo_url ||
                                            "./logo/default.png"
                                        }
                                        alt={brand}
                                        className="w-20 h-20 object-contain mr-auto"
                                    />
                                    <CardTitle></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {details.autoNuove && (
                                        <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-4">
                                            <div className="space-y-2">
                                                <p className="text-gray-700 text-md">
                                                    <strong>
                                                        Nuove In Stock:
                                                    </strong>{" "}
                                                    {details.autoNuove[
                                                        "In Stock"
                                                    ]?.count || 0}{" "}
                                                    unità
                                                </p>
                                                <p className="text-gray-700 text-md">
                                                    <strong>Assegnato:</strong>{" "}
                                                    {details.autoNuove[
                                                        "Assegnato"
                                                    ]?.count || 0}{" "}
                                                    unità
                                                </p>
                                                <p className="text-gray-700 text-md">
                                                    <strong>Virtuali:</strong>{" "}
                                                    {details.autoNuove[
                                                        "Virtuale"
                                                    ]?.count || 0}{" "}
                                                    unità
                                                </p>
                                            </div>
                                            <div className="space-y-2 border-l border-gray-300 pl-4">
                                                <p className="text-gray-700 text-md">
                                                    <strong>
                                                        Valore Nuove:
                                                    </strong>{" "}
                                                    €{" "}
                                                    {details.autoNuove[
                                                        "In Stock"
                                                    ]?.valore?.toLocaleString() ||
                                                        "0"}
                                                </p>
                                                <p className="text-gray-700 text-md">
                                                    <strong>
                                                        Valore Assegnato:
                                                    </strong>{" "}
                                                    €{" "}
                                                    {details.autoNuove[
                                                        "Assegnato"
                                                    ]?.valore?.toLocaleString() ||
                                                        "0"}
                                                </p>
                                                <p className="text-gray-700 text-md">
                                                    <strong>
                                                        Valore Virtuali:
                                                    </strong>{" "}
                                                    €{" "}
                                                    {details.autoNuove[
                                                        "Virtuale"
                                                    ]?.valore?.toLocaleString() ||
                                                        "0"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {details.autoUsate && (
                                        <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-4">
                                            <div className="space-y-2">
                                                <p className="text-gray-700 text-md">
                                                    <strong>
                                                        Usate In Stock:
                                                    </strong>{" "}
                                                    {details.autoUsate[
                                                        "In Stock"
                                                    ]?.count || 0}{" "}
                                                    unità
                                                </p>
                                                <p className="text-gray-700 text-md">
                                                    <strong>Assegnato:</strong>{" "}
                                                    {details.autoUsate[
                                                        "Assegnato"
                                                    ]?.count || 0}{" "}
                                                    unità
                                                </p>
                                            </div>
                                            <div className="space-y-2 border-l border-gray-300 pl-4">
                                                <p className="text-gray-700 text-md">
                                                    <strong>
                                                        Valore Usate:
                                                    </strong>{" "}
                                                    €{" "}
                                                    {details.autoUsate[
                                                        "In Stock"
                                                    ]?.valore?.toLocaleString() ||
                                                        "0"}
                                                </p>
                                                <p className="text-gray-700 text-md">
                                                    <strong>
                                                        Valore Assegnato:
                                                    </strong>{" "}
                                                    €{" "}
                                                    {details.autoUsate[
                                                        "Assegnato"
                                                    ]?.valore?.toLocaleString() ||
                                                        "0"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    )
                ) : (
                    <p className="text-gray-500">
                        ⚠️ Nessun dato disponibile...
                    </p>
                )}
            </div>
        </div>
    );
}
