import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    const [auto, setAuto] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
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

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = auto.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(auto.length / rowsPerPage);

  return (
    <div className="p-6">

      <Card className=" flex-1 border border-slate-700 rounded-md">
        <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
            <CardTitle className="text-sm text-white font-light">
            Lista Auto in Stock presenti in DALMA
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modello</TableHead>
                  <TableHead>Versione</TableHead>
                  <TableHead>Colore</TableHead>
                  <TableHead>Linea</TableHead>
                  <TableHead>Targa</TableHead>
                  <TableHead>Telaio</TableHead>
                  <TableHead>KM</TableHead>
                  <TableHead>Data Imm.</TableHead>
                  <TableHead>Alimentazione</TableHead>
                  <TableHead>Azienda</TableHead>
                  <TableHead>Ubicazione</TableHead>
                  <TableHead>Status</TableHead>
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
                        <TableCell>{car.descr_linea}</TableCell>
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
                                    






                                    {/*
                                    <div className="text-md font-semibold pb-2">
                                        [{car.codice_marca}] {car.marca} [{car.codice_versione}] {car.modello} {car.descr_versione}
                                    </div>
                                
                                        
                                        <div className="flex col-span-2">
                                        <div className="text-md font-semibold pb-1">
                                            <div><span className="text-sm">Azienda:</span> <br /> {car.company || "-"}</div>
                                        </div>

                                        <div className="text-md font-semibold pb-2">
                                            <div><span className="text-sm">Ubicazione:</span> <br /> {car.descr_ubicazione || "-"}</div>
                                        </div>
                                        </div>
                                        

                                        
                                        <div className="flex col-span-5">
                                                <div><strong>Codice Interno:</strong> {car.codice_interno || "N/D"}</div>
                                                <div><strong>Eurotax:</strong> {car.cod_eurotax_gamma || "N/D"}</div>
                                                <div><strong>Area Commerciale:</strong> {car.area_comm}</div>
                                                <div><strong>Neopatentato:</strong> {car.neopatentato === "N" ? "No" : "Sì"}</div>
                                                <div><strong>Prezzo Base:</strong> €{car.prezzo2.toLocaleString()}</div>
                                                <div><strong>Canale Uscita:</strong> {car.canale_uscita_descr || "N/D"}</div>
                                                <div><strong>Categoria Linea:</strong> {car.categoria_linea}</div>
                                                <div><strong>CO2:</strong> {car.co2 || "N/D"}</div>
                                                <div><strong>Data Arrivo:</strong> {car.data_arrivo ? new Date(car.data_arrivo).toLocaleDateString() : "N/D"}</div>
                                                <div><strong>Tipo Cambio:</strong> {car.tipo_cambio}</div>
                                        </div>

                                        
                                        <div className="flex col-span-4">

                                        </div>

                                    <div className="mt-2">
                                        <strong>NOTE:</strong><br />{car.note || "—"}
                                    </div>*/}
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
        <Pagination>
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