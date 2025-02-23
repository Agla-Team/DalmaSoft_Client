import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";

const backUrl = import.meta.env.VITE_BACKEND_URL;
const frontUrl = import.meta.env.VITE_FRONT_URL;

export default function AutoTable() {
    const [auto, setAuto] = useState({ autoConLogo: [] });
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const rowsPerPage = 20;
  
    useEffect(() => {
    fetch(`${backUrl}/api/auto/stock_interno`)
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
    <div className="p-6">

      {/* 5 Card Principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pb-4">
        <Card className="border border-red-700 rounded-md">
          <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
            <CardTitle className="text-sm text-white font-light">Auto In Stock presenti in DALMA</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold">{auto.totaleAuto} veicoli</p>
            <p className="text-lg text-gray-500">Valore: €{auto.autoConLogo?.reduce((acc, car) => acc + (car.pricePlusVat || 0), 0).toLocaleString() || "0,00"}</p>
          </CardContent>
        </Card>

        <Card className="border border-yellow-600 rounded-md">
          <CardHeader className="p-2 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-t">
            <CardTitle className="text-sm text-white font-light">{auto.conteggioPerSede?.[0]?.sede || "-"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold">{auto.conteggioPerSede?.[0]?.numero_auto || 0} {auto.conteggioPerSede?.[0]?.numero_auto === 1 ? "veicolo" : "veicoli"}</p>
            <p className="text-lg text-gray-500">Valore: €{auto.conteggioPerSede?.[0]?.totale_prezzo.toLocaleString() || "0,00"}</p>
          </CardContent>
        </Card>

        <Card className="border border-yellow-600 rounded-md">
          <CardHeader className="p-2 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-t">
            <CardTitle className="text-sm text-white font-light">{auto.conteggioPerSede?.[1]?.sede || "-"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold">{auto.conteggioPerSede?.[1]?.numero_auto || 0} {auto.conteggioPerSede?.[1]?.numero_auto === 1 ? "veicolo" : "veicoli"}</p>
            <p className="text-lg text-gray-500">Valore: €{auto.conteggioPerSede?.[1]?.totale_prezzo.toLocaleString() || "0,00"}</p>
          </CardContent>
        </Card>

        <Card className="border border-yellow-600 rounded-md">
          <CardHeader className="p-2 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-t">
            <CardTitle className="text-sm text-white font-light">{auto.conteggioPerSede?.[2]?.sede || "-"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold">{auto.conteggioPerSede?.[2]?.numero_auto || 0} {auto.conteggioPerSede?.[2]?.numero_auto === 1 ? "veicolo" : "veicoli"}</p>
            <p className="text-lg text-gray-500">Valore: €{auto.conteggioPerSede?.[2]?.totale_prezzo.toLocaleString() || "0"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2 pb-4">
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

      <Card className="flex-1 border border-slate-700 rounded-md p-0">
        <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
            <CardTitle className="text-sm text-white font-light">
            Lista Auto in Stock presenti in DALMA
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="text-red-800">Marca</TableHead>
                  <TableHead className="text-red-800">Modello</TableHead>
                  <TableHead className="text-red-800">Versione</TableHead>
                  <TableHead className="text-red-800">Colore</TableHead>
                  <TableHead className="text-red-800">Linea</TableHead>
                  <TableHead className="text-red-800">Targa</TableHead>
                  <TableHead className="text-red-800">Telaio</TableHead>
                  <TableHead className="text-red-800">KM</TableHead>
                  <TableHead className="text-red-800">Data Imm.</TableHead>
                  <TableHead className="text-red-800">Alimentazione</TableHead>
                  <TableHead className="text-red-800">Azienda</TableHead>
                  <TableHead className="text-red-800">Ubicazione</TableHead>
                  <TableHead className="text-red-800">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      {Array(15).fill().map((_, i) => (
                        <TableCell key={i}><Skeleton className="h-6 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                    currentRows.map((car) => (
                    <>
                      {/* Riga principale */}
                      <TableRow key={car.id}>
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
                            <TableCell colSpan={20} className="p-4">
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

                                            <div className="text-start">Prezzo Optionals</div>
                                            <div className="text-end">€{car.optionalsPrice.toLocaleString() || '0,00'}</div>
                                            <div className="text-end">€{(car.optionalsPrice * 1.22).toLocaleString() || '0,00'}</div>

                                            <div className="text-start">Prezzo Aziendale</div>
                                            <div className="text-end">€{car.normalPrice.toLocaleString()}</div>
                                            <div className="text-end">€{(car.normalPrice * 1.22).toLocaleString()}</div>

                                            <div className="text-start">Accessori</div>
                                            <div className="text-end">€0,00</div>
                                            <div className="text-end">€0,00</div>

                                            <div className="text-start">Spese</div>
                                            <div className="text-end">€0,00</div>
                                            <div className="text-end">€0,00</div>

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
                  ))
                )}
              </TableBody>
        </Table>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination className="pb-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
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
  );
}