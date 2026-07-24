import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);
ChartJS.defaults.font.family = "Inter, sans-serif";
ChartJS.defaults.color = "#667785";
