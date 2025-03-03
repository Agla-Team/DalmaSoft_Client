/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function DeskRanking({ tickets, isLoading }) {
    const deskCount = useMemo(() => {
        return tickets
            .filter((ticket) => ticket.desk)
            .reduce((acc, ticket) => {
                const desk = ticket.desk?.desk;
                acc[desk] = (acc[desk] || 0) + 1;
                return acc;
            }, {});
    }, [tickets]);
    const sortedDesks = Object.entries(deskCount).sort((a, b) => b[1] - a[1]);

    return (
        <Card className="shadow-none min-h-[400px] overflow-hidden flex flex-col w-full h-full">
            <CardHeader className="p-3 ">
                <CardTitle className="t text-red-700 whitespace-nowrap overflow-hidden max-w-full">
                    Ticket per postazione
                </CardTitle>
            </CardHeader>
            <CardContent className="auto-grid p-4 flex flex-col items-center grow justify-center text-center">
                {isLoading ? (
                    <span className="text- ">loading...</span>
                ) : sortedDesks.length > 0 ? (
                    sortedDesks.map(([desk, count]) => (
                        <div
                            key={desk}
                            className="border-b border-gray-200 flex items-center justify-between w-full text-center py-2 px-3 text-black"
                        >
                            <p className="text-xl uppercase font-bold">
                                <span className="font-bold">{desk}</span>
                            </p>
                            <p className="text-md ">
                                {count} ticket{count > 1 ? "s" : ""}
                            </p>
                        </div>
                    ))
                ) : (
                    <span className="text-gray-500">Nessun ticket</span>
                )}
            </CardContent>
        </Card>
    );
}
