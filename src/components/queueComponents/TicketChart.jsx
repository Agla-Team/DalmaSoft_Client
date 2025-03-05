/* eslint-disable react/prop-types */
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export function TicketChart({ data }) {
    return (
        <ResponsiveContainer height={400}>
            <BarChart
                data={data}
                margin={{ right: 12, top: 10, bottom: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "#4A5568", fontSize: 12 }}
                />
                <YAxis
                    tick={{ fill: "#b91c1c", fontSize: 12 }}
                    allowDecimals={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "4px",
                        border: "1px solid #E2E8F0",
                        padding: "8px",
                    }}
                />
                <Bar dataKey="count" stroke="#ed5e5e" fill="rgba(237, 94, 94, 0.5)" barSize={30} />
            </BarChart>
        </ResponsiveContainer>
    );
}
