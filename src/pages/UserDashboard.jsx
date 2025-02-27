import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
//import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { io } from "socket.io-client";
import moment from "moment";
import { TicketChart } from "@/components/chart_ticket";
import OnlineBoxCard from "@/components/OnlineBoxCard";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [onlineDesk, setOnline] = useState([]);
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));
  const [currentDate, setCurrentDate] = useState(moment().format("DD-MM-YYYY"));
  const [lastCalledTicket, setLastCalledTicket] = useState(null);

  const socket = useMemo(() => {
    const newSocket = io(import.meta.env.VITE_SOKETIO_BACK, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    return newSocket
  }, [])

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    };
    return () => {
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [socket]);

  // ===> Gestione realtime dei nuovi ticket creati
  useEffect(() => {
    const handleCreatedTicket = (newticket) => {
      setTickets(prev => {
        return [...prev, newticket]
      });
    }

    socket.on('createdTicket', handleCreatedTicket);
    return () => {
      socket.off('createdTicket', handleCreatedTicket);
    }
  }, [socket]);

  // ===> Gestione realtime dell'aggioranamento dello stato di un determinato ticket
  useEffect(() => {
    const handleEditTicket = (editedTicket) => {

      setTickets(prev => {
        return prev.map(ticket => {
          if (ticket?.id === editedTicket?.id) {
            return editedTicket;
          } else {
            return ticket;
          }
        })
      });

      if (editedTicket.status === 'waiting') {
        setLastCalledTicket(editedTicket);
      }
    }


    socket.on('editedTicket', handleEditTicket);
    return () => {
      socket.off('editedTicket', handleEditTicket);
    }
  }, [socket]);

  // ===> Recupera tutti i ticket del giorno
  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch("https://screen.dalmaweb.it/api/tickets?api_key=c0019162439910429df65e809aca9c2a");
      const data = await response.json();
      setTickets(data);
    };

    fetchTickets();
  }, []);

  /*RECUPERA I DESK*/
  useEffect(() => {
    const fetchDesk = async () => {
      try {
        const response = await fetch("https://screen.dalmaweb.it/api/desks/all?api_key=c0019162439910429df65e809aca9c2a");
        const dataOnline = await response.json();
        setOnline(dataOnline);
      } catch (error) {
        console.error("Errore nel recupero dei desk online:", error);
      }
    };

    fetchDesk();
  }, []);

  /*AGGIORNA ORARIO*/
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const deskCount = tickets.filter(ticket => ticket.desk).reduce((acc, ticket) => {
    const desk = ticket.desk?.desk;
    acc[desk] = (acc[desk] || 0) + 1;
    return acc;
  }, {});

  const sortedDesks = Object.entries(deskCount).sort((a, b) => b[1] - a[1]);

  const ticketTypeCount = tickets.reduce(
    (acc, ticket) => {
      acc[ticket.prefix] = (acc[ticket.prefix] || 0) + 1;
      return acc;
    },
    { S: 0, K: 0 }
  );

  const latestTickets = [...tickets].sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 10);

  const hourlyData = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 6; // Inizia dalle 6 del mattino fino alle 20
    return {
      hour: `${hour}:00`,
      count: tickets.filter(ticket => moment(ticket.created).hour() === hour).length
    };
  });

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

  const getStatoLabel = (status) => statoTicket[status] || "Stato sconosciuto";

  return (
    <>
      <div className="auto-grid">
        <OnlineBoxCard currentDate={currentDate} currentTime={currentTime} onlineDesk={onlineDesk} />

        <Card className="shadow-lg border border-red-700 rounded-lg flex flex-col justify-between w-full h-full">
          <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
            <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
              Ticket Gestiti Oggi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 flex flex-col justify-center rounded-lg items-center h-full bg-slate-200">
            <span className="pt-2 uppercase text-gray-500">TICKET LAVORATI</span>
            <p className="text-3xl font-bold">{tickets.filter(ticket => ticket.status !== 'to_do')?.length}</p>

            <span className="pt-2 uppercase text-gray-500">TICKET ANNULLATI</span>
            <p className="text-3xl font-bold">{tickets.filter(ticket => ticket.status == 'skipped')?.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-red-700 rounded-lg flex flex-col justify-between w-full h-full">
          <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
            <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
              Top Desk
            </CardTitle>
          </CardHeader>
          <CardContent className="auto-grid p-4 pt-1 flex flex-col rounded-lg items-center justify-center h-full bg-slate-200">
            {sortedDesks.map(([desk, count]) => (
              <Badge key={desk.id} className="bg-slate-700 text-white items-center justify-center w-full text-center p-3">
                <div className="flex flex-col items-center">
                  <p className="text-2xl font-bold"><span className="font-bold">{desk}</span></p>
                  <p className="text-1xl font-light uppercase"><span className="text-lg">{count} ticket{count > 1 ? 's' : ''}</span></p>
                </div>
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-red-700 rounded-lg flex flex-col justify-between w-full h-full">
          <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
            <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
              Ticket per Tipo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 flex flex-col rounded-lg justify-center items-center h-full bg-slate-200">
            <div><p className="text-3xl font-bold"><strong>S:</strong> {ticketTypeCount.S}</p></div>
            <div><p className="text-3xl font-bold"><strong>K:</strong> {ticketTypeCount.K}</p></div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-yellow-600 rounded-lg flex flex-col justify-between h-full w-full">
          <CardHeader className="p-2 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-t">
            <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
              Ultimo Ticket Chiamato
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 flex flex-col rounded-lg items-center justify-center h-full bg-slate-200">
            {lastCalledTicket ? (
              <>
                <span className="pt-2 uppercase text-gray-500">TICKET</span>
                <h2 className="text-[3em] font-bold">
                  <div>{lastCalledTicket?.number}</div>
                </h2>
                <div className="px-5 py-2 bg-black text-neutral-200 rounded-md">
                  <h3 className="font-bold text-[2em]">
                    <div>{lastCalledTicket?.desk?.desk || "N/A"}</div>
                  </h3>
                </div>
              </>
            ) : (
              <div>Nessun ticket in corso</div>
            )}
          </CardContent>
        </Card>

      </div>

      <div className="auto-grid gap-4 items-stretch">

        <Card className="col-span-5 shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle>Ultimi 10 Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tikets</TableHead>
                  <TableHead>Desk</TableHead>
                  <TableHead>Stato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestTickets.map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.number}</TableCell>
                    <TableCell>
                      <Badge className={ticket.desk?.desk ? "bg-slate-200 text-slate-800" : "bg-red-100 text-red-800"}>
                        {ticket.desk?.desk || "In attesa di chiamata"}
                      </Badge></TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[ticket.status] || "bg-yellow-200 text-yellow-800"}`}>
                        {getStatoLabel(ticket.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-7 shadow-lg bg-white p-4 rounded-lg flex flex-col h-full">
          <CardHeader>
            <CardTitle>Distribuzione Ticket per Ora</CardTitle>
          </CardHeader>
          <CardContent>

            {/*GRAFICO TICKET*/}
            <TicketChart data={hourlyData} className="h-full w-full flex-1" />

          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;

