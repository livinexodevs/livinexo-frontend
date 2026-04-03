"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface SpendingChartProps {
  data: { month: string; total: number }[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  return (
    <div className="w-full overflow-hidden -ml-2">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c4611f" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#c4611f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d4" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#88755e", fontSize: 11 }}
            axisLine={{ stroke: "#e5e0d4" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "#88755e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            width={45}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "Spending"]}
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e0d4",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "13px",
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#c4611f"
            strokeWidth={2.5}
            fill="url(#colorSpending)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
