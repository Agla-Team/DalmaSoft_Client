/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

export default function Last10TicketsStatus({ tickets }) {
    const last10tickets = useMemo(() => {
        return tickets.sort((a, b) => b.number - a.number).slice(0, 10);
    }, [tickets]);

    const statusColors = {
        done: "bg-green-100 text-green-800",
        to_do: "bg-red-100 text-red-800",
        in_progress: "bg-yellow-200 text-yellow-800",
        skipped: "bg-gray-100 text-gray-800",
    };

    const statoTicket = {
        to_do: "Prenotato",
        waiting: "Chiamato",
        in_progress: "In lavorazione",
        done: "Lavorato",
        skipped: "Annullato",
    };

    const getStatoLabel = (status) =>
        statoTicket[status] || "Stato sconosciuto";

    return (
        <Card className="col-span-5 shadow-none">
            <CardHeader className="p-3">
                <CardTitle className="text-red-700">Ultimi 10 Ticket</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Numero</TableHead>
                            <TableHead>Desk</TableHead>
                            <TableHead>Stato</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length > 0
                            ? last10tickets.map((ticket) => (
                                  <TableRow key={ticket.id}>
                                      <TableCell>{ticket.number}</TableCell>
                                      <TableCell>
                                          <Badge
                                              className={
                                                  ticket.desk?.desk
                                                      ? "bg-slate-200 text-slate-800 shadow-none"
                                                      : "bg-red-100 text-red-800 shadow-none"
                                              }
                                          >
                                              {ticket.desk?.desk ||
                                                  "In attesa di chiamata"}
                                          </Badge>
                                      </TableCell>
                                      <TableCell>
                                          <Badge
                                              className={` shadow-none ${
                                                  statusColors[ticket.status] ||
                                                  "bg-yellow-200 text-yellow-800"
                                              }`}
                                          >
                                              {getStatoLabel(ticket.status)}
                                          </Badge>
                                      </TableCell>
                                  </TableRow>
                              ))
                            : Array.from({ length: 10 }).map((_, idx) => (
                                  <TableRow key={idx} className="h-12" />
                              ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
