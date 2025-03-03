/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function VehiclesDetailsCard({ title, count, value }) {
    return (
        <Card className="shadow-none border rounded-md flex flex-col bg-gray-100/70 min-h-[150px]">
            <CardHeader className="p-3">
                <CardTitle className=" text-red-700">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col justify-between grow">
                <div className="mb-8">
                    <p className="text-5xl font-semibold">{count}</p>
                    <span className="text-lg uppercase">veicoli</span>
                </div>
                <p className="text-lg">valore: €{value}</p>
            </CardContent>
        </Card>
    );
}
