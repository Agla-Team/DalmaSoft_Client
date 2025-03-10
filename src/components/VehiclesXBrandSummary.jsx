/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader } from "./ui/card";

export default function VehiclesXBrandSummary({ brand, details }) {
    let euro = Intl.NumberFormat("en-DE", {
        style: "currency",
        currency: "EUR",
    });

    return (
        <Card className="shadow-none border">
            <CardHeader className="">
                <div className="w-full flex justify-between items-start">
                    <h3 className="font-semibold text-red-700">
                        {brand.replace("_", " ")}
                    </h3>

                    <div className="w-20 h-20">
                        <img
                            src={details.logo_url || "./logo/default.png"}
                            alt={brand}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {details.autoNuove && (
                    <div className="grid grid-cols-2">
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h4 className="font-semibold">
                                    Nuove In Stock
                                </h4>
                                <span className="text-gray-700 text-md">
                                    {details.autoNuove.Generale?.count || 0}{" "}
                                    unità
                                </span>
                            </div>

                            <div className="border-b pb-2">
                                <h4 className="font-semibold">Assegnato</h4>
                                <span className="text-gray-700 text-md">
                                    {details.autoNuove["Assegnato"]?.count || 0}{" "}
                                    unità
                                </span>
                            </div>

                            <div>
                                <h4 className="font-semibold">Virtuali</h4>
                                <span className="text-gray-700 text-md">
                                    {details.autoNuove["Virtuale"]?.count || 0}{" "}
                                    unità
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 text-end">
                            <div className="border-b pb-2">
                                <h4 className="font-semibold">Valore Nuove</h4>
                                <span className="text-gray-700 text-md">
                                    {euro.format(
                                        details.autoNuove.Generale?.valore ||
                                            "0"
                                    )}
                                </span>
                            </div>

                            <div className="border-b pb-2">
                                <h4 className="font-semibold">
                                    Valore Assegnato
                                </h4>
                                <span className="text-gray-700 text-md">
                                    €{" "}
                                    {details.autoNuove[
                                        "Assegnato"
                                    ]?.valore?.toLocaleString() || "0"}
                                </span>
                            </div>

                            <div>
                                <h4 className="font-semibold">
                                    Valore Virtuali
                                </h4>
                                <span className="text-gray-700 text-md">
                                    €{" "}
                                    {details.autoNuove[
                                        "Virtuale"
                                    ]?.valore?.toLocaleString() || "0"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {details.autoUsate && (
                    <div className="grid grid-cols-2">
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h4 className="font-semibold">
                                    Usate In Stock
                                </h4>
                                <span className="text-gray-700 text-md">
                                    {details.autoUsate.Generale?.count || 0}{" "}
                                    unità
                                </span>
                            </div>

                            <div className="border-b pb-2">
                                <h4 className="font-semibold">Assegnato</h4>
                                <span className="text-gray-700 text-md">
                                    {details.autoUsate["Assegnato"]?.count || 0}{" "}
                                    unità
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 text-end">
                            <div className="border-b pb-2">
                                <h4 className="font-semibold">Valore Usate</h4>
                                <span className="text-gray-700 text-md">
                                    {euro.format(
                                        details.autoUsate.Generale?.valore ||
                                            "0"
                                    )}
                                </span>
                            </div>

                            <div className="border-b pb-2">
                                <h4 className="font-semibold">
                                    Valore Assegnato
                                </h4>
                                <span className="text-gray-700 text-md">
                                    €{" "}
                                    {details.autoUsate[
                                        "Assegnato"
                                    ]?.valore?.toLocaleString() || "0"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
