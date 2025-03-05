/* eslint-disable react/prop-types */
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function PrefixTicketPieChart({ data }) {
    const COLORS = ["#3182CE", "#63B3ED"];

    return (
        <ResponsiveContainer height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}
