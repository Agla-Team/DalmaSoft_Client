/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function LastTicketCalled({ lastCalledTicket }) {
    return (
        <Card className="shadow-none min-h-[400px] flex flex-col w-full overflow-hidden">
            <CardHeader className="p-3">
                <CardTitle className=" text-red-700 whitespace-nowrap overflow-hidden max-w-full">
                    Ultimo Ticket Chiamato
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 flex flex-col rounded-lg items-center justify-center grow">
                {lastCalledTicket ? (
                    <>
                        <h2 className="text-8xl font-bold">
                            <div>{lastCalledTicket?.number}</div>
                        </h2>
                        <div className=" text-black">
                            <h3 className="uppercase font-bold text-[2em]">
                                {lastCalledTicket?.desk?.desk || "N/A"}
                            </h3>
                        </div>
                    </>
                ) : (
                    <span className="text-gray-500">
                        Nessun ticket in corso
                    </span>
                )}
            </CardContent>
        </Card>
    );
}
