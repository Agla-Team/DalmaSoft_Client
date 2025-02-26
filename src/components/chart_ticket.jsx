"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TicketChart({ data }) {
  return (
    
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="hour" 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8} 
              tick={{ fill: "#4A5568", fontSize: 12 }} 
            />
            <YAxis 
              tick={{ fill: "#4A5568", fontSize: 12 }} 
              allowDecimals={false} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "white", borderRadius: "8px", padding: "8px", borderColor: "#CBD5E0" }}
              labelStyle={{ fontWeight: "bold", color: "#2D3748" }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#c9004c" 
              fill="#35446c" 
              fillOpacity={0.4} 
            />
          </AreaChart>
        </ResponsiveContainer>
  );
}
