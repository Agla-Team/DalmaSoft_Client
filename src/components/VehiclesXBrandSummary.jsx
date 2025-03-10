/* eslint-disable react/prop-types */
import { euro } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function VehiclesXBrandSummary({ option, brand, details, setSelectedFilters }) {
    return (
        <Card className="shadow-none border">
            <CardHeader className="">
                <div className="w-full flex justify-between items-start">
                    <h3 className="font-semibold text-red-700">
                        {brand.replace("_", " ")}
                    </h3>

                    <div className="w-20 h-20">
                        {/* <img
                            src={details.logo_url || "./logo/default.png"}
                            alt={brand}
                            className="w-full h-full object-cover object-center"
                        /> */}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {details.autoNuove && (
                    <div className="grid grid-cols-2">
                        <div className="space-y-4">
                            <div className="pb-2">
                                <h4 className="font-semibold">
                                    {option !== 'generale' ? option : 'Totale'}
                                </h4>
                                <span className="text-gray-700 text-md">
                                    {details.autoNuove[option.toLowerCase().replace(' ', '_')]?.count || 0}{" "}
                                    unità
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 text-end">
                            <div className="pb-2">
                                <h4 className="font-semibold">Valore</h4>
                                <span className="text-gray-700 text-md">
                                    {euro.format(
                                        details.autoNuove[option.toLowerCase().replace(' ', '_')]?.valore ||
                                        "0"
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {details.autoUsate && (
                    <div className="grid grid-cols-2">
                        <div className="space-y-4">
                            <div className="pb-2">
                                <h4 className="font-semibold">
                                    Usate In Stock
                                </h4>
                                <span className="text-gray-700 text-md">
                                    {details.autoUsate[option.toLowerCase().replace(' ', '_')]?.count || 0}{" "}
                                    unità
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 text-end">
                            <div className="pb-2">
                                <h4 className="font-semibold">Valore Usate</h4>
                                <span className="text-gray-700 text-md">
                                    {euro.format(
                                        details.autoUsate[option.toLowerCase().replace(' ', '_')]?.valore ||
                                        "0"
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-9 flex justify-end">
                    <Link className="flex items-center text-sm" to={brand !== "DALMA_USATO" ? "/infinity_interno" : "/infinity_interno_usate"} onClick={() => setSelectedFilters(prev => !prev.includes('marca') ? [...prev, 'marca'] : prev.filter(e => e !== 'marca'))}>
                        <span className="text-red-700">Scopri</span>
                        <ArrowRight className="text-red-700" width={18} />
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
