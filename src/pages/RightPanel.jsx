import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const backUrl = import.meta.env.VITE_BACKEND_URL;
const frontUrl = import.meta.env.VITE_FRONT_URL;

export default function RightPanel({ refreshTrigger }) {
  // Stati per i conteggi e i brand
  const [counts, setCounts] = useState({ inStock: 0, inventariate: 0 });
  const [brands, setBrands] = useState([]);

  // Stati per le auto non inventariate
  const [validRecords, setValidRecords] = useState([]);       // auto con telaio valido
  const [incompleteRecords, setIncompleteRecords] = useState([]); // auto con telaio null o vuoto

  // Stato per la paginazione della tabella validRecords
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  useEffect(() => {
    async function fetchNonInventariate() {
      try {
        const res = await fetch(`${backUrl}/api/inventario/non-inventariate`);
        const data = await res.json();
        // Imposta separatamente i due array
        setValidRecords(data.valid || []);
        setIncompleteRecords(data.incomplete || []);
        // Reset della paginazione per validRecords
        setCurrentPage(1);
      } catch (error) {
        console.error("Errore nel recupero delle auto non inventariate:", error);
      }
    }

    fetchNonInventariate();
  }, [refreshTrigger]);

  // Paginazione per validRecords
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentValidRecords = validRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(validRecords.length / recordsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="space-y-6">

      {/* Prima tabella: Auto Nuove non inventariate (validRecords) con paginazione */}
      <Card className="shadow-md">
        <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
          <CardTitle className="text-sm text-white font-light">
            Auto da Inventariare
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5">Telaio</TableHead>
                <TableHead className="w-1/5">Targa</TableHead>
                <TableHead className="w-1/5">Marca</TableHead>
                <TableHead className="w-1/5">Modello</TableHead>
                <TableHead className="w-1/5">Ubicazione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentValidRecords.length > 0 ? (
                currentValidRecords.map((auto) => (
                  <TableRow key={auto.telaio}>
                    <TableCell className="w-1/5">{auto.telaio}</TableCell>
                    <TableCell className="w-1/5">{auto.targa}</TableCell>
                    <TableCell className="w-1/5">{auto.marca}</TableCell>
                    <TableCell className="w-1/5">{auto.modello}</TableCell>
                    <TableCell className="w-1/5">{auto.descr_ubicazione}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nessuna auto non inventariata trovata.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Controlli di paginazione */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-yellow-500 text-white hover:bg-yellow-600"}`}
            >
              Precedente
            </button>
            <span className="text-gray-700">
              Pagina {currentPage} di {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded ${currentPage === totalPages || totalPages === 0 ? "bg-gray-300" : "bg-yellow-500 text-white hover:bg-yellow-600"}`}
            >
              Successiva
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Seconda tabella: Auto Nuove non inventariate con telaio nullo o vuoto */}
      <Card className="shadow-md">
        <CardHeader className="p-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-t">
          <CardTitle className="text-sm text-white font-light">
            Auto con dati incompleti da INFINITY
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5">Telaio</TableHead>
                <TableHead className="w-1/5">Targa</TableHead>
                <TableHead className="w-1/5">Marca</TableHead>
                <TableHead className="w-1/5">Modello</TableHead>
                <TableHead className="w-1/5">Ubicazione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incompleteRecords.length > 0 ? (
                incompleteRecords.map((auto, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-1/5">{auto.telaio || "N/A"}</TableCell>
                    <TableCell className="w-1/5">{auto.targa}</TableCell>
                    <TableCell className="w-1/5">{auto.marca}</TableCell>
                    <TableCell className="w-1/5">{auto.modello}</TableCell>
                    <TableCell className="w-1/5">{auto.descr_ubicazione}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nessuna auto con telaio mancante trovata.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
