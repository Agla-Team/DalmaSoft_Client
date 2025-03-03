import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const backUrl = import.meta.env.VITE_BACKEND_URL;


export function UbiExt() {
    const [auto, setAuto] = useState({ autoConLogo: [] });
    const [expandedRow, setExpandedRow] = useState(null);
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    const [containerWidth, setContainerWidth] = useState("100vw");

    // Effetto per aggiornare isMobile quando cambia la dimensione dello schermo
    useEffect(() => {

        const updateWidth = () => {
            const sidebar = document.querySelector(".Sidebar"); // Modifica con la classe corretta della sidebar
            const sidebarWidth = sidebar ? sidebar.offsetWidth : 0;
            setContainerWidth(`calc(100vw - ${sidebarWidth}px)`);

            setIsMobile(window.innerWidth < 640);
          };

          updateWidth();
                
        // Aggiunge un listener al resize della finestra
        window.addEventListener("resize", updateWidth);

        // Rimuove il listener quando il componente si smonta
        return () => window.removeEventListener("resize", updateWidth);
    }, []);
  
    useEffect(() => {
    fetch(`${backUrl}/api/auto/stock_esterno_usate`)
    .then((response) => response.json())
      .then((data) => {
        console.log(data)
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

    const conteggioPerSedeOrdinato = Array.isArray(auto.conteggioPerSede) 
    ? [...auto.conteggioPerSede] // 🔹 Clona l'array per evitare mutazioni
        .sort((a, b) => b.numero_auto - a.numero_auto) // 🔹 Ordina dal più grande a zero
        .filter(sede => sede.numero_auto > 0)
        .slice(0, 20)
        : [];

    return (    
        <div className={isMobile ? "reel containerWidth" : "auto-grid containerWidth"}>

            <div className="row-span-3">
            <Card className="border border-red-700 rounded-md flex flex-col justify-between w-full h-full">
                <CardHeader className="p-2 bg-gradient-to-br from-red-800 to-red-700 rounded-t">
                <CardTitle className="text-[14px] text-white font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">
                    IN STOCK ESTERNO
                </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 flex flex-col items-center justify-center h-full">
                <p className="text-3xl font-bold">{auto.totaleAuto} veicoli</p>
                <p className="text-sm text-gray-500">
                    Valore: €{auto.autoConLogo?.reduce((acc, car) => acc + (car.pricePlusVat || 0), 0).toLocaleString() || "0,00"}
                </p>
                </CardContent>
            </Card>
            </div>
            
            {conteggioPerSedeOrdinato.map((sede,i) => 
                
                (
                    <div key={i}>
                    <Card className="border border-yellow-600 rounded-md flex flex-col justify-between h-full w-full">
                        <CardHeader className="p-2 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-t">
                        <CardTitle className="text-[11px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[17px] text-slate-800 font-bold truncate text-center whitespace-nowrap overflow-hidden max-w-full">{sede?.sede || "-"}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1 flex flex-col justify-center items-center h-full">
                        <p className="text-2xl font-bold">{sede?.numero_auto || 0} {sede?.numero_auto === 1 ? "veicolo" : "veicoli"}</p>
                        <p className="text-sm text-gray-500">Valore: €{sede?.totale_prezzo.toLocaleString() || "0,00"}</p>
                        </CardContent>
                    </Card>
                    </div> 
                )
            )}
            

        </div>
    )
}