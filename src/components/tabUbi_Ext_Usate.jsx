import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";

const backUrl = import.meta.env.VITE_BACKEND_URL;

export function TabUbiExt() {
    const [auto, setAuto] = useState({ autoConLogo: [] });
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const rowsPerPage = 20;
  
    useEffect(() => {
    fetch(`${backUrl}/api/auto/stock_esterno_usate`)
    .then((response) => response.json())
      .then((data) => {
        setAuto(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore nel recupero dei dati:", error);
        setLoading(false);
      });
    }, []);

    const toggleExpand = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const autoList = auto.autoConLogo || [];

    // Funzione per filtrare le auto in base alla ricerca
    const filteredRows = autoList.filter(car => {
        const searchTerms = searchTerm.toLowerCase().split(",").map(term => term.trim()); // Divide i termini con la virgola

        return searchTerms.every(term => 
        car.marca?.toLowerCase().includes(term) || 
        car.telaio?.toLowerCase().includes(term) ||
        car.modello?.toLowerCase().includes(term) ||
        car.targa?.toLowerCase().includes(term) ||
        car.descr_versione?.toLowerCase().includes(term) ||
        car.alimentazione?.toLowerCase().includes(term) ||
        car.descr_ubicazione?.toLowerCase().includes(term)
        );
    });

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    return (    
    <div className="flex flex-col w-full max-w-full gap-4">
        <div className="pb-4 pt-4 w-full p-0">
            <Label htmlFor="search">Cerca</Label>
            <Input 
                id="search"
                type="text" 
                placeholder="Cerca per Marca, Telaio, Modello, Targa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-gradient-to-br from-gray-200 to-gray-100 text-black border rounded-md"
            />
        </div>

        <div className="pb-4 pt-4 w-full p-0">
        <Card className="border border-slate-700 rounded-md p-0 w-[100%]">
            <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
                <CardTitle className="text-sm text-white font-light">
                Lista Auto in Stock presenti in DALMA
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                
                    <Table>
                        <TableHeader className="bg-gray-200">
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead className="text-red-800 uppercase">Marca</TableHead>
                                <TableHead className="text-red-800 uppercase">Modello</TableHead>
                                <TableHead className="text-red-800 uppercase">Versione</TableHead>
                                <TableHead className="text-red-800 uppercase">Colore</TableHead>
                                <TableHead className="text-red-800 uppercase">Linea</TableHead>
                                <TableHead className="text-red-800 uppercase">Targa</TableHead>
                                <TableHead className="text-red-800 uppercase">Telaio</TableHead>
                                <TableHead className="text-red-800 uppercase">KM</TableHead>
                                <TableHead className="text-red-800 uppercase">Data Imm.</TableHead>
                                <TableHead className="text-red-800 uppercase">Alimentazione</TableHead>
                                <TableHead className="text-red-800 uppercase">Azienda</TableHead>
                                <TableHead className="text-red-800 uppercase">Ubicazione</TableHead>
                                <TableHead className="text-red-800 uppercase">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, index) => (
                                    <TableRow key={`skeleton-row-${index}`}>
                                        {Array(15).fill().map((_, n) => (
                                            <TableCell key={`skeleton-cell-${index}-${n}`}><Skeleton className="h-6 w-full" /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                currentRows.map((car, index) => (
                                    <React.Fragment key={`fragment-${car.id || index}`}>
                                <>
                                    {/* Riga principale */}
                                    <TableRow key={`row-${car.id || index}`}>
                                        <TableCell>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => toggleExpand(car.id)}
                                            >
                                            {expandedRow === car.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{car.marca}</TableCell>
                                        <TableCell>{car.modello}</TableCell>
                                        <TableCell>{car.descr_versione}</TableCell>
                                        <TableCell>{car.descr_colore || "N/D"}</TableCell>
                                        <TableCell>{car.descr_linea === "Prodotto DEMO" || car.descr_linea === "Prodotto KM0" ? (
                                                                <span className="text-yellow-500">{car.descr_linea}</span>
                                                            ) : car.descr_linea === "Prodotto NORMALE" ? (
                                                                <span className="text-green-800">{car.descr_linea}</span>
                                                            ) : (
                                                                <span>{car.descr_linea || "-"}</span>
                                                            )}</TableCell>
                                        <TableCell>{car.targa}</TableCell>
                                        <TableCell>{car.telaio}</TableCell>
                                        <TableCell>{car.km_percorsi}</TableCell>
                                        <TableCell>{car.data_immatricolazione ? new Date(car.data_immatricolazione).toLocaleDateString() : "N/D"}</TableCell>
                                        <TableCell>{car.alimentazione}</TableCell>
                                        <TableCell>{car.company}</TableCell>
                                        <TableCell>{car.descr_ubicazione}</TableCell>
                                        <TableCell>
                                            <Badge className="bg-green-800 text-white px-3 py-1 rounded-md">
                                                {car.status_veicolo_desc}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>

                                    {/* Riga espansa con dettagli migliorati */}
                                    {expandedRow === car.id && (
                                    <TableRow className="bg-gray-100">
                                        <TableCell colSpan={15} className="p-4">
                                            <div className="grid grid-cols-12 gap-4">
                                                
                                                {/* Logo del Brand */}
                                                <div className="col-span-1 justify-center items-center">

                                                <div className="flex justify-center items-center space-x-2 pb-4">
                                                {car.logo_url && (
                                                    <img src={car.logo_url} alt={car.marca} className="h-[100px] w-[100px] object-auto" />
                                                )}

                                                </div>

                                                <div className="flex justify-center items-center space-x-2 pb-4">
                                                    {/* Targa con grafica migliorata */}
                                                    {car.targa && (
                                                    <div className="flex items-center border border-blue-600 rounded-lg overflow-hidden">
                                                        <div className="bg-blue-600 h-10 w-4"></div>
                                                        <div className="px-3 py-1 text-lg font-bold text-black bg-white">
                                                        {car.targa}
                                                        </div>
                                                        <div className="bg-blue-600 h-10 w-4"></div>
                                                    </div>
                                                    )}
                                                </div>    
                                                <div className="flex justify-center items-center space-x-2 pb-4"> 
                                                    {/* Telaio come Badge */}
                                                    {car.telaio && (
                                                    <Badge variant="secondary" className="bg-gray-300 text-gray-900 px-3 py-1 rounded-md">
                                                        {car.telaio}
                                                    </Badge>
                                                    )}
                                                </div>

                                                </div>

                                                {/* Dettagli Auto */}
                                                <div className="col-span-11">

                                                    <TableRow className="bg-gray-100">
                                                        <TableCell colSpan={15} className="p-4">
                                                            <div className="grid grid-cols-12 gap-4">
                                                    
                                                                {/* PRIMA RIGA (12 colonne) - Informazioni Generali */}
                                                                <div className="col-span-12 text-md font-semibold pb-2">
                                                                    [{car.codice_marca}] {car.marca} [{car.codice_versione}] {car.modello} {car.descr_versione}
                                                                </div>

                                                                {/* SECONDA RIGA (3 colonne da 3 spazi + 1 colonna per i prezzi) */}
                                                                {/* Colonna 1 (3 spazi) - Azienda, Ubicazione, Linea */}
                                                                <div className="col-span-3">
                                                                    <div className="font-semibold uppercase text-red-800">Azienda</div> <div>{car.company || "-"}</div>
                                                                    <div className="font-semibold uppercase mt-2 text-red-800">Ubicazione</div> <div>{car.descr_ubicazione || "-"}</div>
                                                                    <div className="font-semibold uppercase mt-2 text-red-800">Linea</div> {car.descr_linea === "Prodotto DEMO" || car.descr_linea === "Prodotto KM0" ? (
                                                                                                                                                            <span className="text-yellow-500">{car.descr_linea}</span>
                                                                                                                                                        ) : car.descr_linea === "Prodotto NORMALE" ? (
                                                                                                                                                            <span className="text-green-800">{car.descr_linea}</span>
                                                                                                                                                        ) : (
                                                                                                                                                            <span>{car.descr_linea || "-"}</span>
                                                                                                                                                        )}
                                                                </div>

                                                                {/* Colonna 2 (3 spazi) - Colore, Alimentazione, Tipo Cambio */}
                                                                <div className="col-span-3">
                                                                    <div className="font-semibold uppercase text-red-800">Colore</div> <div>{car.descr_colore || "-"}</div>
                                                                    <div className="font-semibold uppercase mt-2 text-red-800">Alimentazione</div> <div>{car.alimentazione || "-"}</div>
                                                                    <div className="font-semibold uppercase mt-2 text-red-800">Tipo Cambio</div> <div>{car.tipo_cambio || "-"}</div>
                                                                </div>

                                                                {/* Colonna 3 (3 spazi) - Codice Interno, Area Commerciale, Data di Arrivo, Prima Immatricolazione */}
                                                                <div className="col-span-3">
                                                                    <div className="font-semibold uppercase text-red-800">Codice Interno:</div> <div>{car.codice_interno || "-"}</div>
                                                                    <div className="font-semibold uppercase mt-2 text-red-800">Area Commerciale:</div> <div>{car.area_comm}</div>
                                                                    <div className="font-semibold uppercase mt-2 text-red-800">Data di Arrivo:</div> <div>{car.data_arrivo ? new Date(car.data_arrivo).toLocaleDateString() : "-"}</div>
                                                                    <div className="font-semibold uppercase mt-2 text-red-800">Prima Immatricolazione:</div> <div>{car.data_immatricolazione ? new Date(car.data_immatricolazione).toLocaleDateString() : "-"}</div>
                                                                </div>

                                                                {/* Colonna 4 (3 spazi) - Prezzi divisi in 3 sottocolonne */}
                                                                <div className="col-span-3 grid grid-cols-3 gap-2">
                                                                    <div className="font-semibold uppercase text-start text-red-800">Voce</div>
                                                                    <div className="font-semibold uppercase text-end text-red-800">Prezzo Imponibile</div>
                                                                    <div className="font-semibold uppercase text-end text-red-800">Prezzo Ivato</div>

                                                                    <div className="text-start">Prezzo Veicolo</div>
                                                                    <div className="text-end">€{car.salePrice.toLocaleString()}</div>
                                                                    <div className="text-end">€{car.salePricePlusVat.toLocaleString()}</div>

                                                                    <div className="font-semibold text-start">Totale</div>
                                                                    <div className="font-semibold text-end">€{car.price.toLocaleString()}</div>
                                                                    <div className="font-semibold text-end">€{car.pricePlusVat.toLocaleString()}</div>
                                                                </div>

                                                                {/* ULTIMA RIGA (12 colonne) - NOTE */}
                                                                <div className="col-span-12 mt-2">
                                                                    <strong>NOTE:</strong> {car.note || "—"}
                                                                </div>

                                                            </div>
                                                        </TableCell>
                                                    </TableRow>

                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    )}
                                    </>
                                </React.Fragment>
                                
                            ))
                            )}
                        </TableBody>
                    </Table>

                <div className="flex justify-center mt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                href="#"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                />
                            </PaginationItem>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <PaginationItem key={`page-${index}`}>
                                    <PaginationLink
                                        href="#"
                                        onClick={() => setCurrentPage(index + 1)}
                                        isActive={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                    </PaginationItem>
                                ))}
                            <PaginationItem>
                                <PaginationNext
                                href="#"
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </Card>
        </div>
    </div>
    )
}