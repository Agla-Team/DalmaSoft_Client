import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import "tailwindcss/tailwind.css";

const backUrl = import.meta.env.VITE_BACKEND_URL;

const CalendarPlanning = () => {
    const [appointments, setAppointments] = useState([]);
    const [bookingDates, setBookingDates] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [collapsedGroups, setCollapsedGroups] = useState({});
    
    useEffect(() => {
        fetch(`${backUrl}/api/checkpoint/all`)
            .then((response) => response.json())
            .then((data) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const formattedAppointments = data.map((item) => {
                    const bookingDate = item.bookingDate ? new Date(item.bookingDate) : null;
                    return {
                        id: item.uid,
                        targaTelaio: `${item.licenseNumber}`,
                        marca: `[${item.brand}] ${item.brandDescription}`,
                        modello: `[${item.model}]`,
                        descrmodello: `${item.modelDescription}`,
                        cliente: `[${item.customerId}] ${item.customerName}`,
                        mail: `${item.email || "-"}`,
                        tel: `${item.mobile}`,
                        accettatore: `[${item.serviceAdvisor}] ${item.serviceAdvisorName}`,
                        idDoc: item.orderId,
                        numDoc: item.orderNumber,
                        dataDoc: item.expectedDeliveryDate ? new Date(item.expectedDeliveryDate).toLocaleDateString("it-IT") : "N/D",
                        bookingDate: bookingDate ? bookingDate.toISOString().split("T")[0] : "N/D",
                        ora: bookingDate ? new Date(bookingDate).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "N/D"
                    };
                });
                
                const uniqueBookingDates = [...new Set(formattedAppointments.map(item => item.bookingDate))]
                    .map(date => new Date(date))
                    .filter(date => date >= today)
                    .sort((a, b) => a - b)
                    .map(date => date.toISOString().split("T")[0]);
                
                setBookingDates(uniqueBookingDates);
                setAppointments(formattedAppointments);
                
                if (uniqueBookingDates.length > 0) {
                    setCurrentIndex(0);
                }
            })
            .catch((error) => console.error("Errore nel recupero dati: ", error));
    }, []);

    const currentDate = bookingDates[currentIndex] || "N/D";
    const filteredRows = appointments.filter((item) => item.bookingDate === currentDate);
    
    const groupedByHour = filteredRows.reduce((acc, appointment) => {
        acc[appointment.ora] = acc[appointment.ora] || [];
        acc[appointment.ora].push(appointment);
        return acc;
    }, {});

    const toggleGroup = (hour) => {
        setCollapsedGroups(prevState => ({
            ...prevState,
            [hour]: !prevState[hour]
        }));
    };

    return (
        <div className="pb-4 pt-4 w-full flex flex-col items-start">
            <div className="flex items-center bg-gray-100 rounded-lg py-2 px-4 mb-4 shadow-md w-fit">
                <button 
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
                    }}
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="mx-4 text-lg font-medium text-gray-700">
                    {new Date(currentDate).toLocaleDateString("it-IT", { weekday: "short", day: "2-digit", month: "long" })}
                </span>
                <Calendar className="text-blue-500 mx-2" size={20} />
                <button 
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                        const todayIndex = bookingDates.indexOf(new Date().toISOString().split("T")[0]);
                        if (todayIndex !== -1) setCurrentIndex(todayIndex);
                    }}
                >
                    Oggi
                </button>
                <button 
                    className="text-blue-500 hover:text-blue-700 ml-4"
                    onClick={() => {
                        if (currentIndex < bookingDates.length - 1) setCurrentIndex(currentIndex + 1);
                    }}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
            
            <Card className="border border-slate-700 rounded-md p-0 w-full mx-0">
                <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
                    <CardTitle className="text-sm text-white font-light">
                        Planning Appuntamenti
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {Object.keys(groupedByHour).sort().map((hour) => (
                        <div key={hour} className="mb-4">
                            <h3 className="text-lg font-semibold p-2 bg-gray-200 flex justify-start cursor-pointer" onClick={() => toggleGroup(hour)}>
                                {collapsedGroups[hour] ? <ChevronDown size={20} className="mr-2" /> : <ChevronUp size={20} className="mr-2" />}
                                Appuntamenti delle {hour}
                            </h3>
                            {!collapsedGroups[hour] && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>TARGA/TELAIO</TableHead>
                                            <TableHead>Marca</TableHead>
                                            <TableHead>Modello</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Contatti</TableHead>
                                            <TableHead>Accettatore</TableHead>
                                            <TableHead>Id Doc</TableHead>
                                            <TableHead>Num. Doc</TableHead>
                                            <TableHead>Data Doc</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {groupedByHour[hour].map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="w-[3%] text-start">
                                                    <div className="inline-flex items-center h-5 border border-blue-600 rounded-sm overflow-hidden">
                                                        <div className="bg-blue-600 h-5 w-2"></div>
                                                        <div className="p-1 py-0 text-sm font-light text-black bg-white whitespace-nowrap">{item.targaTelaio}</div>
                                                        <div className="bg-blue-600 h-5 w-2"></div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="w-[8%] text-start">{item.marca}</TableCell>
                                                <TableCell className="w-[27%] text-start">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{item.modello}</span>
                                                        <span className="text-gray-600">{item.descrmodello}</span>
                                                    </div>
                                                </TableCell>                                                
                                                <TableCell className="w-[15%] text-start">{item.cliente}</TableCell>
                                                <TableCell className="w-[14%] text-start">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{item.tel}</span>
                                                        <span className="text-gray-600">{item.mail}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="w-[13%] text-start">{item.accettatore}</TableCell>
                                                <TableCell className="w-[4%] text-start">{item.idDoc}</TableCell>
                                                <TableCell className="w-[4%] text-start">{item.numDoc}</TableCell>
                                                <TableCell className="w-[10%] text-start">{item.dataDoc}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default CalendarPlanning;
