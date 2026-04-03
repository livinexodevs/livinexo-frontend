"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CategoryChartProps {
  data: { category: string; total: number }[];
}

const COLORS = [
  "#c4611f",
  "#db7b2a",
  "#e39548",
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#6366f1",
];

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="w-full overflow-hidden">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="45%"
            outerRadius="70%"
            innerRadius="40%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e0d4",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "13px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={40}
            iconSize={8}
            formatter={(value) => (
              <span className="text-[10px] sm:text-xs text-sand-700">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
