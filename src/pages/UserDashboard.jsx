import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { io } from "socket.io-client";
import moment from "moment";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [currentTime, setCurrentTime] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));
  const [lastCalledTicket, setLastCalledTicket] = useState(null);

  const socket = useMemo(() => {
    const newSocket = io(import.meta.env.VITE_SOKETIO_BACK,{
      autoConnect:false,
      reconnection:true,
      reconnectionAttempts:5,
      reconnectionDelay:1000,
    });
    return newSocket
  },[])

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()      
    };
    return () => {
      if (socket.connected) {
        socket.disconnect()        
      }
    }
  },[socket])

  // ===> Gestione realtime dei nuovi ticket creati
  useEffect(() => {
    const handleCreatedTicket = (newticket) => {
      setTickets(prev=>{
        return [...prev, newticket]
      });
    }

    socket.on('createdTicket', handleCreatedTicket);
    return () => {
      socket.off('createdTicket', handleCreatedTicket);
    }
  }, [])

  // ===> Gestione realtime dell'aggioranamento dello stato di un determinato ticket
  useEffect(() => {
    const handleEditTicket = (editedTicket) => {
      setTickets(prev=>{
        return prev.map(ticket => {
          if (ticket?.id === editedTicket?.id) {
            return editedTicket;
          }else {
            return ticket;
          }
        })
      });
      
      if (editedTicket.status === 'in_progress') {
        setLastCalledTicket(editedTicket);
      }
    }


    socket.on('editedTicket', handleEditTicket);
    return () => {
      socket.off('editedTicket', handleEditTicket);
    }
  }, []);
  
  // ===> Recupera tutti i ticket del giorno
  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch("https://screen.dalmaweb.it/api/tickets?api_key=c0019162439910429df65e809aca9c2a");
      const data = await response.json();
      setTickets(data);
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format("YYYY-MM-DD HH:mm:ss"));
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

  const inProgressTicket = tickets.find(ticket => ticket.status === "in_progress");

  const latestTickets = [...tickets].sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 10);

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    count: tickets.filter(ticket => moment(ticket.created).hour() === i).length
  }));

  const statusColors = {
    done: "bg-green-700 text-white",
    to_do: "bg-red-700 text-white",
    in_progress: "bg-yellow-600 text-black",
    skipped: "bg-gray-600 text-white",
  };

  return (
    <>
    <div className="auto-grid">
      <Card className="border border-red-700 rounded-md flex flex-col justify-between w-full h-full">
        <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
          <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
            Data e Ora Corrente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 flex flex-col justify-center items-center h-full">
        <p className="text-2xl font-bold">{currentTime}</p>
        </CardContent>
      </Card>

      <Card className="border border-red-700 rounded-md flex flex-col justify-between w-full h-full">
        <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
          <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
            Ticket Gestiti Oggi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 flex flex-col justify-center items-center h-full">
          <p className="text-3xl font-bold">{tickets.filter(ticket => ticket.status !== 'to_do')?.length}</p>
        </CardContent>
      </Card>
      
      <Card className="border border-red-700 rounded-md flex flex-col justify-between w-full h-full">
        <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
          <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
            Top Desk
          </CardTitle>
        </CardHeader>
        <CardContent className="auto-grid p-4 pt-1 flex flex-col items-center justify-center h-full">
          {sortedDesks.map(([desk, count]) => (
            <div key={desk} className="flex flex-col items-center">
                <div className="px-5 py-2 bg-yellow-600 text-neutral-200 rounded-md">
                  <p className="text-2xl font-bold text-cyan-950"><span className="font-bold">{desk}</span></p>
                  <p className="text-1xl font-bold text-slate-900"><span className="text-md">{count} ticket{count > 1 ? 's' : ''}</span></p>
                </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="border border-red-700 rounded-md flex flex-col justify-between w-full h-full">
        <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
          <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
            Ticket per Tipo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 flex flex-col justify-center items-center h-full">
          <div><p className="text-3xl font-bold"><strong>S:</strong> {ticketTypeCount.S}</p></div>
          <div><p className="text-3xl font-bold"><strong>K:</strong> {ticketTypeCount.K}</p></div>
        </CardContent>
      </Card>
      
        <Card className="border border-yellow-600 rounded-md flex flex-col justify-between h-full w-full">
          <CardHeader className="p-2 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-t">
            <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
                Ticket Chiamato
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 flex flex-col items-center justify-center h-full">
          {inProgressTicket ? (
            <>
            <h3>Il numero</h3>
              <h2 className="text-[3em] font-bold">
                <div>{lastCalledTicket.number}</div>
              </h2>
            <div className="px-5 py-2 bg-black text-neutral-200 rounded-md">
              <h3 className="font-bold text-[2em]">
                <div>{lastCalledTicket.desk?.desk || "N/A"}</div>
              </h3>
            </div>
            </>
          ) : (
            <div>Nessun ticket in corso</div>
          )}
        </CardContent>
        </Card>
      
    </div>

    <div className="auto-grid">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Ultimi 10 Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Box</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestTickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.number}</TableCell>
                  <TableCell>
                    <Badge className={ticket.desk?.desk ? "bg-green-700 text-white" : "bg-red-500 text-white"}>
                      {ticket.desk?.desk || "In attesa di chiamata"}
                    </Badge></TableCell>
                  <TableCell>
                  <Badge className={`${statusColors[ticket.status] || "bg-gray-500 text-white"}`}>
                    {ticket.status}
                  </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Distribuzione Ticket per Ora</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default Dashboard;

