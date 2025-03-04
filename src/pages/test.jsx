import React, { useEffect, useState} from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TestDashboard() {
    return (
        <>
            <div className="auto-grid max-w-screen-2xl grid-cols-7 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <Card key={item} className="max-h-[6rem] overflow-hidden">
                    <CardHeader>
                        <CardTitle>Card {item}</CardTitle>
                    </CardHeader>
                    <CardContent className="line-clamp-4">
                        {/* Inserisci qui il contenuto (massimo 4 righe) */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}