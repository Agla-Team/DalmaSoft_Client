/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader } from "./ui/card";

export default function VehiclesXBrandSummary({ brand, details }) {
    return (
        <Card className="shadow-none border">
            <CardHeader className="">
                <div className="w-full flex justify-between items-start">
                    <h3 className="font-semibold text-red-700">{brand.replace('_', ' ')}</h3>

                    <div className="w-20 h-20 bg-gray-100"></div>
                    {/* <img
                    src={
                        details.logo_url ||
                        "./logo/default.png"
                    }
                    alt={brand}
                    className="w-20 h-20 object-contain mr-auto"
                /> */}
                </div>
            </CardHeader>
            <CardContent>
                {
                    details.autoNuove && (
                        <div className="grid grid-cols-2">
                            <div className="space-y-4">

                                <div className="border-b pb-2">
                                    <h4 className="font-semibold">Nuove In Stock</h4>
                                    <span className="text-gray-700 text-md">
                                        {details.autoNuove[
                                            "In Stock"
                                        ]?.count || 0}{" "}
                                        unità
                                    </span>
                                </div>

                                <div className="border-b pb-2">
                                    <h4 className="font-semibold">Assegnato</h4>
                                    <span className="text-gray-700 text-md">
                                        {details.autoNuove[
                                            "Assegnato"
                                        ]?.count || 0}{" "}
                                        unità
                                    </span>
                                </div>

                                <div>
                                    <h4 className="font-semibold">Virtuali</h4>
                                    <span className="text-gray-700 text-md">
                                        {details.autoNuove[
                                            "Virtuale"
                                        ]?.count || 0}{" "}
                                        unità
                                    </span>
                                </div>
                            </div>


                            <div className="space-y-4 text-end">
                                <div className="border-b pb-2">
                                    <h4 className="font-semibold">Valore Nuove</h4>
                                    <span className="text-gray-700 text-md">
                                        €{" "}
                                        {details.autoNuove[
                                            "In Stock"
                                        ]?.valore?.toLocaleString() ||
                                            "0"}
                                    </span>
                                </div>

                                <div className="border-b pb-2">
                                    <h4 className="font-semibold">Valore Assegnato</h4>
                                    <span className="text-gray-700 text-md">
                                        €{" "}
                                        {details.autoNuove[
                                            "Assegnato"
                                        ]?.valore?.toLocaleString() ||
                                            "0"}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="font-semibold">Valore Virtuali</h4>
                                    <span className="text-gray-700 text-md">
                                        €{" "}
                                        {details.autoNuove[
                                            "Virtuale"
                                        ]?.valore?.toLocaleString() ||
                                            "0"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    details.autoUsate && (
                        <div className="grid grid-cols-2">
                            <div className="space-y-4">
                                <div className="border-b pb-2">
                                    <h4 className="font-semibold">Usate In Stock</h4>
                                    <span className="text-gray-700 text-md">
                                        {details.autoUsate[
                                            "In Stock"
                                        ]?.count || 0}{" "}
                                        unità
                                    </span>
                                </div>

                                <div className="border-b pb-2">
                                    <h4 className="font-semibold">Assegnato</h4>
                                    <span className="text-gray-700 text-md">
                                        {details.autoUsate[
                                            "Assegnato"
                                        ]?.count || 0}{" "}
                                        unità
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 text-end">
                                <div className="border-b pb-2">
                                    <h4 className="font-semibold">Valore Usate</h4>
                                    <span className="text-gray-700 text-md">
                                        €{" "}
                                        {details.autoUsate[
                                            "In Stock"
                                        ]?.valore?.toLocaleString() ||
                                            "0"}
                                    </span>
                                </div>

                                <div className="border-b pb-2">
                                    <h4 className="font-semibold">Valore Assegnato</h4>
                                    <span className="text-gray-700 text-md">
                                        €{" "}
                                        {details.autoUsate[
                                            "Assegnato"
                                        ]?.valore?.toLocaleString() ||
                                            "0"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                }
            </CardContent >
        </Card >
    )
}
