"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { formatDate } from "@/lib/utils";

interface ProgressEntry {
  date: string;
  cardsStudied: number;
  accuracy: number;
}

interface ProgressChartProps {
  entries: ProgressEntry[];
}

export function CardsStudiedChart({ entries }: ProgressChartProps) {
  const data = entries.map((e) => ({
    date: formatDate(e.date),
    cards: e.cardsStudied,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5D9C5" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7A6B55" }} />
        <YAxis tick={{ fontSize: 11, fill: "#7A6B55" }} />
        <Tooltip
          contentStyle={{
            background: "#FEF9F0",
            border: "1px solid #E5D9C5",
            borderRadius: "12px",
            fontSize: "12px",
          }}
        />
        <Line
          type="monotone"
          dataKey="cards"
          stroke="#A51C30"
          strokeWidth={2.5}
          dot={{ fill: "#A51C30", r: 4 }}
          activeDot={{ r: 6 }}
          name="Cards"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AccuracyChart({ entries }: ProgressChartProps) {
  const data = entries.map((e) => ({
    date: formatDate(e.date),
    accuracy: Math.round(e.accuracy),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5D9C5" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7A6B55" }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#7A6B55" }} />
        <Tooltip
          contentStyle={{
            background: "#FEF9F0",
            border: "1px solid #E5D9C5",
            borderRadius: "12px",
            fontSize: "12px",
          }}
          formatter={(val) => [`${val}%`, "Accuracy"]}
        />
        <Bar dataKey="accuracy" fill="#C5A028" radius={[4, 4, 0, 0]} name="Accuracy %" />
      </BarChart>
    </ResponsiveContainer>
  );
}
