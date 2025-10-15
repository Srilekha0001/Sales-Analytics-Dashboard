from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        # Load CSV
        try:
            df = pd.read_csv(file, encoding="utf-8")
        except UnicodeDecodeError:
            file.seek(0)
            df = pd.read_csv(file, encoding="latin1")

        df.columns = [c.strip().lower() for c in df.columns]
        print("📊 Columns:", df.columns.tolist())

        # Auto-map
        date_col = "orderdate" if "orderdate" in df.columns else "date"
        product_col = "productline" if "productline" in df.columns else "productcode"
        region_col = "country" if "country" in df.columns else "territory"
        sales_col = "sales" if "sales" in df.columns else "priceeach"

        df = df[[date_col, product_col, region_col, sales_col]].rename(columns={
            date_col: "date",
            product_col: "product",
            region_col: "region",
            sales_col: "sales"
        })
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df["sales"] = pd.to_numeric(df["sales"], errors="coerce").fillna(0)
        df.dropna(subset=["date"], inplace=True)
        df = df[df["sales"] > 0]

        # KPIs
        total_sales = round(df["sales"].sum(), 2)
        avg_sales = round(df["sales"].mean(), 2)
        num_orders = len(df)
        top_product = df.groupby("product")["sales"].sum().idxmax()
        top_region = df.groupby("region")["sales"].sum().idxmax()

        # Monthly trend
        df["month"] = df["date"].dt.to_period("M").astype(str)
        monthly_sales = df.groupby("month")["sales"].sum().reset_index()

        # Regional breakdown
        region_sales = df.groupby("region")["sales"].sum().reset_index()

        # Top 5 products
        product_sales = df.groupby("product")["sales"].sum().reset_index().sort_values("sales", ascending=False).head(5)

        # Insight summary
        insight_text = (
            f"Total sales reached ${total_sales:,.0f}. "
            f"The average order value is ${avg_sales:,.0f}. "
            f"{top_product} is the top-performing product line, "
            f"with {top_region} leading in regional revenue."
        )

        return jsonify({
            "total_sales": total_sales,
            "avg_sales": avg_sales,
            "num_orders": num_orders,
            "top_product": top_product,
            "top_region": top_region,
            "months": monthly_sales["month"].tolist(),
            "sales_values": monthly_sales["sales"].astype(float).tolist(),
            "regions": region_sales["region"].tolist(),
            "region_values": region_sales["sales"].astype(float).tolist(),
            "top_products": product_sales["product"].tolist(),
            "product_values": product_sales["sales"].astype(float).tolist(),
            "insight_text": insight_text
        })

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
