import { useContext, useEffect } from "react";
import VehiclesDetailsCard from "@/components/VehiclesDetailsCard";
import VehiclesXBrandSummary from "@/components/VehiclesXBrandSummary";
import { VehiclesContext } from "@/context/vehiclesContext";

export default function AutoGest() {
    const { getOwnedVehicleDataSummary, ownedVehicleDataSummary } =
        useContext(VehiclesContext);

    let euro = Intl.NumberFormat("en-DE", {
        style: "currency",
        currency: "EUR",
    });

    useEffect(() => {
        getOwnedVehicleDataSummary();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <VehiclesDetailsCard
                    title="Auto In Stock"
                    count={ownedVehicleDataSummary.totaleInStock}
                    value={euro.format(ownedVehicleDataSummary.valoreInStock)}
                />

                <VehiclesDetailsCard
                    title="Nuove In Stock"
                    count={ownedVehicleDataSummary.totaleParcoAutoNew}
                    value={euro.format(ownedVehicleDataSummary.valParcoAutoNew)}
                />

                <VehiclesDetailsCard
                    title="Usate In Stock"
                    count={ownedVehicleDataSummary.totaleParcoAutoUse}
                    value={euro.format(ownedVehicleDataSummary.valParcoAutoUse)}
                />

                <VehiclesDetailsCard
                    title="Virtuali"
                    count={ownedVehicleDataSummary.totaleVirtuali}
                    value={euro.format(ownedVehicleDataSummary.valoreVirtuali)}
                />

                <VehiclesDetailsCard
                    title="Assegnate"
                    count={ownedVehicleDataSummary.totaleAssegnate}
                    value={euro.format(ownedVehicleDataSummary.valoreAssegnate)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ownedVehicleDataSummary?.dettagliPerBrand &&
                Object.keys(ownedVehicleDataSummary.dettagliPerBrand).length >
                    0 ? (
                    Object.entries(
                        ownedVehicleDataSummary.dettagliPerBrand
                    ).map(([brand, details]) => (
                        <VehiclesXBrandSummary
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
