import { useContext, useEffect, useState } from "react";
import VehiclesDetailsCard from "@/components/VehiclesDetailsCard";
import VehiclesXBrandSummary from "@/components/VehiclesXBrandSummary";
import { VehiclesContext } from "@/context/vehiclesContext";
import { euro } from "@/lib/utils";

const options = [
    "In Stock",
    "Assegnate",
    "Virtuali",
    "Ordinate",
    "Vendute",
    "Richieste",
    "Ritirate",
    "Stornate"

];

export default function AutoGest() {
    const { getOwnedVehicleDataSummary, ownedVehicleDataSummary, ownedVehicleDataSummaryLoading, setSelectedFilters } =
        useContext(VehiclesContext);
    const [optSelected, setOptSelected] = useState("generale");

    const conditionalRender = (selectedOption) => {
        switch (selectedOption) {
            case "In Stock":
                return (
                    <>
                        <VehiclesDetailsCard
                            title="Nuove In Stock"
                            count={ownedVehicleDataSummary.dettaglio?.auto.inStockNew}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.inStockValNew)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                        <VehiclesDetailsCard
                            title="Usate In Stock"
                            count={ownedVehicleDataSummary.dettaglio?.auto.inStockUse}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.inStockValUse)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />
                    </>
                );

            case "Assegnate":
                return (
                    <>
                        <VehiclesDetailsCard
                            title="Assegnate Nuove"
                            count={ownedVehicleDataSummary.dettaglio?.auto.assegnateNew}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.assegnateValNew)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                        <VehiclesDetailsCard
                            title="Assegnate Usate"
                            count={ownedVehicleDataSummary.dettaglio?.auto.assegnateUse}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.assegnateValUse)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                    </>
                );

            case "Virtuali":
                return (
                    <>
                        <VehiclesDetailsCard
                            title="Virtuali Nuove"
                            count={ownedVehicleDataSummary.dettaglio?.auto.virtualiNew}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.virtualiValNew)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                        <VehiclesDetailsCard
                            title="Virtuali Usate"
                            count={ownedVehicleDataSummary.dettaglio?.auto.virtualiUse}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.virtualiValUse)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                    </>
                );

            case "Ordinate":
                return (
                    <>
                        <VehiclesDetailsCard
                            title="Ordinate Nuove"
                            count={ownedVehicleDataSummary.dettaglio?.auto.ordinateNew}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.ordinateValNew)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                        <VehiclesDetailsCard
                            title="Ordinate Usate"
                            count={ownedVehicleDataSummary.dettaglio?.auto.ordinateUse}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.ordinateValUse)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                    </>
                );

            case "Vendute":
                return (
                    <>
                        <VehiclesDetailsCard
                            title="Vendute Nuove"
                            count={ownedVehicleDataSummary.dettaglio?.auto.venduteNew}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.venduteValNew)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                        <VehiclesDetailsCard
                            title="Vendute Usate"
                            count={ownedVehicleDataSummary.dettaglio?.auto.venduteUse}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.venduteValUse)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                    </>
                );

            case "Richieste":
                return (
                    <>
                        <VehiclesDetailsCard
                            title="Richieste Nuove"
                            count={ownedVehicleDataSummary.dettaglio?.auto.richiesteNew}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.richiesteValNew)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                        <VehiclesDetailsCard
                            title="Richieste Usate"
                            count={ownedVehicleDataSummary.dettaglio?.auto.richiesteUse}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.richiesteValUse)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                    </>
                );

            case "Ritirate":
                return (
                    <>
                        <VehiclesDetailsCard
                            title="Ritirate Nuove"
                            count={ownedVehicleDataSummary.dettaglio?.auto.ritirateNew}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.ritirateValNew)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                        <VehiclesDetailsCard
                            title="Ritirate Usate"
                            count={ownedVehicleDataSummary.dettaglio?.auto.ritirateUse}
                            value={euro.format(ownedVehicleDataSummary.dettaglio?.auto.ritirateValUse)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                    </>
                );

            case "Stornate":
                return (
                    <>
                        <VehiclesDetailsCard
                            title="Stornate Nuove"
                            count={ownedVehicleDataSummary.dettaglio?.auto.stornateNew}
                            value={euro.format(ownedVehicleDataSummary.dettaglio.auto.stornateValNew)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                        <VehiclesDetailsCard
                            title="Stornate Usate"
                            count={ownedVehicleDataSummary.dettaglio.auto.stornateUse}
                            value={euro.format(ownedVehicleDataSummary.dettaglio.auto.stornateValUse)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                    </>
                );

            default:
                return (
                    <div>
                        Grafico
                    </div>
                );
        }
    }

    useEffect(() => {
        getOwnedVehicleDataSummary();
    }, []);

    return (
        <div className="p-6">
            <ul className="border p-2 w-auto max-w-[1000px] rounded-sm flex items-center justify-between text-gray-400 mb-12">
                <li onClick={() => setOptSelected("generale")}>
                    <button className={`cursor-pointer px-2 py-1 rounded ${optSelected === "generale" ? "text-red-700 bg-gray-100 font-semibold" : ""}`}>Totale</button>
                </li>
                {
                    options.map((opt, idx) => (
                        <li key={idx} onClick={() => setOptSelected(opt)}>
                            <button className={`cursor-pointer px-2 py-1 rounded ${optSelected === opt ? "text-red-700 bg-gray-100 font-semibold" : ""}`}>{opt}</button>
                        </li>
                    ))
                }
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-40">
                {conditionalRender(optSelected)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ownedVehicleDataSummary?.dettagliPerBrand &&
                    !ownedVehicleDataSummaryLoading ? (
                    Object.entries(
                        ownedVehicleDataSummary.dettagliPerBrand
                    ).map(([brand, details]) => (
                        <VehiclesXBrandSummary
                            option={optSelected}
                            brand={brand}
                            details={details}
                            setSelectedFilters={setSelectedFilters}
                            key={brand}
                        />
                    ))
                ) : (
                    <p className="text-gray-300">Loading...</p>
                )}
            </div>
        </div>
    );
}
