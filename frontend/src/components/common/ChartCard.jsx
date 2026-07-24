import { Chart } from "react-chartjs-2";
import "./chartSetup.js";
import { Card, CardHead } from "./Card.jsx";

const BASE_OPTIONS = {
  maintainAspectRatio: false,
  plugins: { legend: { position: "top", align: "end" } },
  scales: { y: { grid: { color: "#EEF2F5" } }, x: { grid: { display: false } } },
};

export default function ChartCard({ title, subtitle, type, data, options, tall, action }) {
  return (
    <Card>
      <CardHead title={title} subtitle={subtitle} action={action} />
      <div className={`chart-box ${tall ? "tall" : ""}`}>
        <Chart type={type} data={data} options={{ ...BASE_OPTIONS, ...options }} />
      </div>
    </Card>
  );
}
