import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

const backUrl = import.meta.env.VITE_BACKEND_URL;

export default function TabUbiNewDalma() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // puoi regolare il numero di righe per pagina

  useEffect(() => {
    fetch(`${backUrl}/api/inventario/inventariate_new`)
      .then((response) => response.json())
      .then((data) => {
        // Se la risposta è un array, usalo direttamente
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore nel recupero dei dati:", error);
        setLoading(false);
      });
  }, []);

  // Se l'API restituisce direttamente un array di auto, usalo così
  const autoList = Array.isArray(data) ? data : [];

  // Funzione per filtrare le auto in base alla ricerca
  const filteredRows = autoList.filter((car) => {
    const searchTerms = searchTerm.toLowerCase().split(",").map(term => term.trim());
    return searchTerms.every(
      term =>
        car.marca?.toLowerCase().includes(term) ||
        car.telaio?.toLowerCase().includes(term) ||
        car.modello?.toLowerCase().includes(term) ||
        car.targa?.toLowerCase().includes(term) ||
        car.descr_colore?.toLowerCase().includes(term) ||
        car.alimentazione?.toLowerCase().includes(term) ||
        car.descr_ubicazione?.toLowerCase().includes(term) ||
        car.tipo_cambio?.toLowerCase().includes(term) ||
        car.status_veicolo_desc?.toLowerCase().includes(term) ||
        car.condizione?.toLowerCase().includes(term) ||
        car.tipologia?.toLowerCase().includes(term) ||
        car.building?.toLowerCase().includes(term) ||
        car.area?.toLowerCase().includes(term)
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
              Lista Auto Usate Inventario DALMA
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="text-red-800 uppercase">Marca</TableHead>
                  <TableHead className="text-red-800 uppercase">Modello</TableHead>
                  <TableHead className="text-red-800 uppercase">Colore</TableHead>
                  <TableHead className="text-red-800 uppercase">Targa</TableHead>
                  <TableHead className="text-red-800 uppercase">Telaio</TableHead>
                  <TableHead className="text-red-800 uppercase">Alimentazione</TableHead>
                  <TableHead className="text-red-800 uppercase">Ubicazione</TableHead>
                  <TableHead className="text-red-800 uppercase">Cambio</TableHead>
                  <TableHead className="text-red-800 uppercase">Stato</TableHead>
                  <TableHead className="text-red-800 uppercase">Condizione</TableHead>
                  <TableHead className="text-red-800 uppercase">Tipologia</TableHead>
                  <TableHead className="text-red-800 uppercase">Building</TableHead>
                  <TableHead className="text-red-800 uppercase">Area</TableHead>
                  <TableHead className="text-red-800 uppercase">Prezzo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={`skeleton-row-${index}`}>
                      {Array(12)
                        .fill()
                        .map((_, n) => (
                          <TableCell key={`skeleton-cell-${index}-${n}`}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
                ) : (
                  currentRows.map((car, index) => (
                    <React.Fragment key={`fragment-${car.id || index}`}>
                      <TableRow key={`row-${car.id || index}`}>
                        <TableCell>{/* eventualmente icona o dettaglio */}</TableCell>
                        <TableCell className="uppercase">{car.marca}</TableCell>
                        <TableCell>{car.modello}</TableCell>
                        <TableCell>{car.descr_colore || "N/D"}</TableCell>
                        <TableCell>{car.targa}</TableCell>
                        <TableCell>{car.telaio}</TableCell>
                        <TableCell>{car.alimentazione}</TableCell>
                        <TableCell>{car.descr_ubicazione}</TableCell>
                        <TableCell>{car.tipo_cambio}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-800 text-white px-3 py-1 rounded-md">
                            {car.status_veicolo_desc}
                          </Badge>
                        </TableCell>
                        <TableCell>{car.condizione}</TableCell>
                        <TableCell>{car.tipologia}</TableCell>
                        <TableCell>{car.building}</TableCell>
                        <TableCell>{car.area}</TableCell>
                        <TableCell>€ {car.pricePlusVat.toLocaleString() || "0,00"}</TableCell>
                      </TableRow>
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
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
  );
}
