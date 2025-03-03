/* eslint-disable react/prop-types */
import moment from "moment";
import { TicketChart } from "./TicketChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function HourlyTicketsTrend({ tickets }) {
    const hourlyData = Array.from({ length: 15 }, (_, i) => {
        const hour = i + 6;
        return {
            hour: `${hour}:00`,
            count: tickets.filter(
                (ticket) => moment(ticket.created).hour() === hour
            ).length,
        };
    });

    return (
        <Card className="col-span-7 shadow-none bg-white flex flex-col h-full">
            <CardHeader className="p-3">
                <CardTitle className="text-red-700">
                    Distribuzione Oraria
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <TicketChart
                    data={hourlyData}
                    className="h-full w-full flex-1"
                />
            </CardContent>
        </Card>
    );
}
