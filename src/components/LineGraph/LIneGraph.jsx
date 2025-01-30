import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const LineGraph = ({ data }) => {
  if (!data) return <p className="text-center mt-4 text-red-500">No Data Available</p>;

  const chartData = {
    labels: data.map((point, index) => `Point ${index + 1}`),
    datasets: [
      {
        label: "Stock Prediction",
        data: data,
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineGraph;
