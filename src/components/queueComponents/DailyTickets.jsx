/* eslint-disable react/prop-types */
import { Ticket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMemo } from "react";

const DailyTickets = ({ tickets, isLoading }) => {
    const { done, skipped } = useMemo(() => {
        return tickets
            .filter(
                (ticket) =>
                    ticket.status === "done" || ticket.status === "skipped"
            )
            .reduce(
                (acc, currentTicket) => {
                    acc[currentTicket.status] =
                        (acc[currentTicket.status] || 0) + 1;
                    return acc;
                },
                { done: 0, skipped: 0 }
            );
    }, [tickets]);

    return (
        <Card className="shadow-none flex min-h-[400px] flex-col w-full h-full overflow-hidden">
            <CardHeader className="p-3">
                <CardTitle className=" text-red-700 whitespace-nowrap max-w-full">
                    Ticket Gestiti Oggi
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col space-y-5">
                <div>
                    {isLoading ? (
                        <span>loading...</span>
                    ) : (
                        <>
                            <p className="text-8xl font-bold mb-3">{done}</p>
                            <div className="flex items-center space-x-3">
                                <Ticket width={24} color="#b91c1c" />
                                <span className="text-gray-600">
                                    Ticket Lavorati
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div>
                    {isLoading ? (
                        <span>loading...</span>
                    ) : (
                        <>
                            <p className="text-6xl font-bold mb-3">{skipped}</p>
                            <div className="flex items-center space-x-3">
                                <Ticket width={24} color="#b91c1c" />
                                <span className="text-gray-600">
                                    Ticket Saltati
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default DailyTickets;
