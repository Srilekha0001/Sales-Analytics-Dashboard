import React, { useState, useEffect } from "react";
import Charts from "./components/Charts";
import { motion } from "framer-motion";
import "./styles.css";

function App() {
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please choose a CSV file.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok && !result.error) setData(result);
      else alert(result.error || "Error analyzing file.");
    } catch (err) {
      console.error(err);
      alert("Backend not reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="glass-header">
        <h1 className="gradient-text">📊 Sales Analytics Dashboard 3D</h1>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </header>

      <motion.form
        onSubmit={uploadFile}
        className="upload-section"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </motion.form>

      {data && (
        <>
          <motion.div
            className="cards-grid"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card"><h3>Total Sales</h3><p>${data.total_sales.toLocaleString()}</p></div>
            <div className="glass-card"><h3>Average Sale</h3><p>${data.avg_sales.toLocaleString()}</p></div>
            <div className="glass-card"><h3>Orders</h3><p>{data.num_orders.toLocaleString()}</p></div>
            <div className="glass-card"><h3>Top Product</h3><p>{data.top_product}</p></div>
            <div className="glass-card"><h3>Top Region</h3><p>{data.top_region}</p></div>
          </motion.div>

          <motion.div
            className="insight-box glass-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>🧠 Key Insights</h3>
            <p>{data.insight_text}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Charts data={data} />
          </motion.div>
        </>
      )}
    </div>
  );
}

export default App;
