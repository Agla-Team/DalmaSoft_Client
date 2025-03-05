/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PrefixTicketPieChart from "./PrefixTicketPieChart";

export default function PrefixTickets({ tickets, isLoading }) {
    const { S, K } = useMemo(() => {
        return tickets.reduce(
            (acc, ticket) => {
                acc[ticket.prefix] = (acc[ticket.prefix] || 0) + 1;
                return acc;
            },
            { S: 0, K: 0 }
        );
    }, [tickets]);

    const data = [
        { name: "Officina", value: S },
        { name: "Ingresso Principale", value: K }
    ];

    return (
        <Card className="shadow-none min-h-[400px] border flex flex-col w-full">
            <CardHeader className="p-3">
                <CardTitle className="text-red-700 whitespace-nowrap  max-w-full">
                    Ticket per ingresso
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3 grow">
                {isLoading ? (
                    "loading..."
                ) : (
                    <div className="flex flex-col">
                        <div className="text-md flex items-center justify-between">
                            <span>Ingresso officina: </span>
                            <span>{S}</span>
                        </div>
                        <div className="text-md flex items-center justify-between">
                            <span>Ingresso principale: </span>
                            <span>{K}</span>
                        </div>
                        <div className="grow">
                            <PrefixTicketPieChart data={data} />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
