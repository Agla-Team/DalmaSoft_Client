/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function VehiclesDetailsCard({ title, count, value, isLoading }) {
    return (
        <Card className="min-h-[210px] shadow-none border rounded-md flex flex-col bg-gray-100/70">
            <CardHeader className="p-3">
                <CardTitle className=" text-red-700">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col justify-between grow">
                {
                    !isLoading ? (
                        <>
                            <div className="mb-8">
                                <p className="text-5xl font-semibold">{count}</p>
                                <span className="text-lg uppercase">veicoli</span>
                            </div>
                            <p className="text-lg">valore {value}</p>
                        </>

                    ) : (
                        <div className="flex justify-center items-center h-full">

                            <span>loading...</span>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    );
}
