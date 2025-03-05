/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
                    <>
                        <div className="text-xl flex items-center justify-between">
                            <span>Ingresso officina: </span>
                            <span>{S}</span>
                        </div>
                        <div className="text-xl flex items-center justify-between">
                            <span>Ingresso principale: </span>
                            <span>{K}</span>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
