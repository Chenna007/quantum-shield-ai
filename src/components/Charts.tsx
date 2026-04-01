"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { ScanResult } from "@/utils/api";

const riskBarColors: Record<string, string> = {
  high_risk: "#ff5d5d",
  moderate: "#f7b643",
  secure: "#27d88f",
};

const gaugeColors: Record<string, string> = {
  high_risk: "#ff5d5d",
  moderate: "#f7b643",
  secure: "#27d88f",
};

export function RiskPieChart({ data }: { data: ScanResult }) {
  const pieData = data.charts.risk_pie;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
        <span className="h-2 w-2 rounded-full bg-cyan-300" />
        Risk Distribution
      </h3>
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              animationBegin={500}
              animationDuration={1000}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #334155",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#f9fafb",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-2">
        {pieData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-400">
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function RiskBarChart({ data }: { data: ScanResult }) {
  const barData = data.charts.risk_bar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
        <span className="h-2 w-2 rounded-full bg-cyan-300" />
        Security Metrics
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #334155",
              borderRadius: "12px",
              fontSize: "12px",
              color: "#f9fafb",
            }}
          />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            animationBegin={600}
            animationDuration={1000}
          >
            {barData.map((entry, index) => (
              <Cell
                key={index}
                fill={riskBarColors[entry.risk] || "#38bdf8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function SecurityScoreGauge({ data }: { data: ScanResult }) {
  const { score, level } = data.charts.score_gauge;
  const color = gaugeColors[level] || "#38bdf8";
  const gaugeData = [{ name: "Score", value: score, fill: color }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
        <span className="h-2 w-2 rounded-full bg-cyan-300" />
        Security Score
      </h3>
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            startAngle={180}
            endAngle={0}
            data={gaugeData}
            barSize={16}
          >
            <RadialBar
              background={{ fill: "#1f2937" }}
              dataKey="value"
              cornerRadius={10}
              animationBegin={700}
              animationDuration={1200}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center -mt-16">
        <span className="text-3xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-sm text-slate-400">/100</span>
        <p className="mt-1 text-xs capitalize text-slate-400">{level.replace("_", " ")}</p>
      </div>
    </motion.div>
  );
}
