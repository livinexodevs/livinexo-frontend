"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface MemberChartProps {
  data: { name: string; spent: number; owed: number }[];
}

export function MemberChart({ data }: MemberChartProps) {
  return (
    <div className="w-full overflow-hidden -ml-2">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d4" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#88755e", fontSize: 11 }}
            axisLine={{ stroke: "#e5e0d4" }}
            tickLine={false}
            interval={0}
            angle={data.length > 4 ? -30 : 0}
            textAnchor={data.length > 4 ? "end" : "middle"}
            height={data.length > 4 ? 50 : 30}
          />
          <YAxis
            tick={{ fill: "#88755e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            width={45}
          />
          <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name === "spent" ? "Added" : "Owes",
            ]}
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e0d4",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "13px",
            }}
          />
          <Legend
            iconSize={10}
            formatter={(value) => (
              <span className="text-[10px] sm:text-xs text-sand-700">
                {value === "spent" ? "Amount Added" : "Amount Owed"}
              </span>
            )}
          />
          <Bar dataKey="spent" fill="#c4611f" radius={[6, 6, 0, 0]} />
          <Bar dataKey="owed" fill="#e39548" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
