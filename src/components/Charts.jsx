import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import ThreeDBarChart from "./ThreeDBarChart";

const Charts = ({ data }) => {
  const monthly = data.months.map((m, i) => ({ month: m, sales: data.sales_values[i] }));
  const regional = data.regions.map((r, i) => ({ region: r, sales: data.region_values[i] }));
  const topProducts = data.top_products.map((p, i) => ({ product: p, sales: data.product_values[i] }));

  return (
    <div className="charts-container">
      <div className="chart-card glass-panel">
        <h2>🧊 3D Monthly Sales Visualization</h2>
        <ThreeDBarChart data={data} />
      </div>

      <div className="chart-card glass-panel">
        <h2>📅 Monthly Trend (Line)</h2>
        <ResponsiveContainer width="90%" height={300}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip /><Legend />
            <Line type="monotone" dataKey="sales" stroke="#38bdf8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card glass-panel">
        <h2>🌍 Sales by Region</h2>
        <ResponsiveContainer width="90%" height={300}>
          <BarChart data={regional}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="region" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip /><Legend />
            <Bar dataKey="sales" fill="#818cf8" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card glass-panel">
        <h2>🏆 Top 5 Products</h2>
        <ResponsiveContainer width="90%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="product" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip /><Legend />
            <Bar dataKey="sales" fill="#22d3ee" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
