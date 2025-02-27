/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function OnlineBoxCard({ onlineDesk }) {


    return (
        <Card className=" border border-red-700 rounded-lg flex flex-col justify-between w-full h-full">
            <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
                <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
                    Stato Postazioni
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col rounded-lg items-center h-full ">
                <div className="flex flex-wrap gap-3">
                    {Array.isArray(onlineDesk) && onlineDesk.length > 0 ? (
                        onlineDesk.map((desk) => (
                            <div
                                key={desk?.id}
                                className={`w-full py-2 text-center rounded-md text-white ${desk.online ? "bg-green-500" : "bg-red-500"
                                    }`}
                            >
                                {desk?.desk}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Nessun desk trovato</p>
                    )}
                </div>
            </CardContent>
        </Card>

    )
}
