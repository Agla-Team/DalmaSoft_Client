/* eslint-disable react/prop-types */
import { MonitorDot, ScreenShareOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function OnlineBoxCard({ desks }) {
    return (
        <Card className="shadow-none overflow-hidden flex flex-col justify-between w-full h-full">
            <CardHeader className="p-3">
                <CardTitle className=" text-red-700 whitespace-nowrap overflow-hidden max-w-full">
                    Stato Postazioni
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col rounded-lg items-center h-full ">
                <div className="flex flex-wrap gap-3">
                    {Array.isArray(desks) && desks.length > 0 ? (
                        desks.map((desk) => (
                            <div
                                key={desk?.id}
                                className={`w-full py-2 px-4 flex justify-between border items-center rounded-md text-gray-700 ${
                                    desk.online
                                        ? "bg-green-200 border-green-600"
                                        : "bg-gray-200 border-gray-400"
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    {desk.online ? (
                                        <MonitorDot width={16} />
                                    ) : (
                                        <ScreenShareOff width={16} />
                                    )}

                                    <span className="uppercase">
                                        {desk?.desk}
                                    </span>
                                </div>
                                <div className="space-x-3">
                                    <span className="text-sm">
                                        {desk.online ? "online" : "offline"}
                                    </span>
                                    <div
                                        className={`w-2 h-2 rounded-full inline-block ${
                                            desk.online
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    ></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Nessun desk trovato</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
