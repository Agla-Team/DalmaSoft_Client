import { useContext, useEffect, useState } from "react";
import VehiclesDetailsCard from "@/components/VehiclesDetailsCard";
import VehiclesXBrandSummary from "@/components/VehiclesXBrandSummary";
import { VehiclesContext } from "@/context/vehiclesContext";
import { euro } from "@/lib/utils";

const options = [
    "In Stock",
    "Assegnate",
    "Virtuali"
];

export default function AutoGest() {
    const { getOwnedVehicleDataSummary, ownedVehicleDataSummary, ownedVehicleDataSummaryLoading } =
        useContext(VehiclesContext);
    const [optSelected, setOptSelected] = useState("In Stock");

    const conditionalRender = (selectedOption) => {
        switch (selectedOption) {
            case "In Stock":
                return (
                    <>
                        <VehiclesDetailsCard
                            title="Auto In Stock"
                            count={ownedVehicleDataSummary.totaleInStock}
                            value={euro.format(ownedVehicleDataSummary.valoreInStock)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                        <VehiclesDetailsCard
                            title="Nuove In Stock"
                            count={ownedVehicleDataSummary.totaleParcoAutoNew}
                            value={euro.format(ownedVehicleDataSummary.valParcoAutoNew)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />

                        <VehiclesDetailsCard
                            title="Usate In Stock"
                            count={ownedVehicleDataSummary.totaleParcoAutoUse}
                            value={euro.format(ownedVehicleDataSummary.valParcoAutoUse)}
                            isLoading={ownedVehicleDataSummaryLoading}
                        />
                    </>
                );

            case "Assegnate":
                return (<span>Assegnate</span>);

            case "Virtuali":
                return (<span>Virtuali</span>);
            default:
                break;
        }
    }

    useEffect(() => {
        getOwnedVehicleDataSummary();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <ul className="border p-2 w-auto max-w-[350px] rounded-sm flex items-center justify-between text-gray-400">
                {
                    options.map((opt, idx) => (
                        <li key={idx} onClick={() => setOptSelected(opt)}>
                            <button className={`cursor-pointer px-2 py-1 rounded ${optSelected === opt ? "text-black bg-gray-100" : ""}`}>{opt}</button>
                        </li>
                    ))
                }
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
