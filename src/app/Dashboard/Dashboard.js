import React, { useState, useEffect } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement
);

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Exempeldata för KPI-korten
  const totalSales = 280; // Summa av försäljningar
  const avgLifeExpectancy = 82.5; // Genomsnittlig livslängd
  const avgIncome = 345; // Genomsnittlig inkomst i tusentals kr
  const totalCrimes = 600; // Totalt antal brott i år

  // Exempeldata för diagrammen
  const propertySalesData = {
    labels: ["Lägenheter", "Villor", "Radhus"],
    datasets: [
      {
        label: "Antal Försäljningar 2023",
        data: [150, 90, 40],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const crimeData = {
    labels: ["Stöld", "Våldsbrott"],
    datasets: [
      {
        label: "Antal Brott 2023",
        data: [400, 200],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const avgPriceData = {
    labels: ["Lägenheter", "Villor", "Radhus"],
    datasets: [
      {
        label: "Genomsnittliga Priser (tusentals kr)",
        data: [2900, 4000, 3100],
        backgroundColor: ["#4BC0C0", "#FF6384", "#36A2EB"],
      },
    ],
  };

  const incomeData = {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Genomsnittlig Inkomst (tusentals kr)",
        data: [319, 323, 325, 335, 345],
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  const lifeExpectancyData = {
    labels: ["Män", "Kvinnor", "Totalt"],
    datasets: [
      {
        label: "Förväntad Livslängd 2023",
        data: [80, 85, 82.5],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const schoolResultsData = {
    labels: ["Svenska", "Matematik", "Engelska"],
    datasets: [
      {
        label: "Snittbetyg för Årskurs 9 (2023)",
        data: [14.2, 13.8, 16.0],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const topSchoolsData = {
    labels: ["Skola A", "Skola B", "Skola C"],
    datasets: [
      {
        label: "Betyg för bästa skolor 2023",
        data: [16.8, 15.5, 14.5],
        backgroundColor: ["#4BC0C0", "#9966FF", "#FFCE56"],
      },
    ],
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="dashboard-container p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Statistik Dashboard</h2>

      {/* KPI-kort högst upp */}
      <div className="kpi-container grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="kpi-card bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Totala Försäljningar</h3>
          <p className="text-3xl font-bold">{totalSales}</p>
        </div>
        <div className="kpi-card bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Genomsnittlig Livslängd</h3>
          <p className="text-3xl font-bold">{avgLifeExpectancy} år</p>
        </div>
        <div className="kpi-card bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Genomsnittlig Inkomst</h3>
          <p className="text-3xl font-bold">{avgIncome} tkr</p>
        </div>
        <div className="kpi-card bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Antal Brott i År</h3>
          <p className="text-3xl font-bold">{totalCrimes}</p>
        </div>
      </div>

      {/* Diagram-sektionen */}
      <div className="charts-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Diagram 1: Fastighetsförsäljningar */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Fastighetsförsäljningar</h3>
          <Pie data={propertySalesData} />
        </div>

        {/* Diagram 2: Brottsstatistik */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Brottsfördelning</h3>
          <Bar data={crimeData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>

        {/* Diagram 3: Genomsnittliga priser */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Genomsnittliga Fastighetspriser</h3>
          <Bar data={avgPriceData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>

        {/* Diagram 4: Inkomstdata */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Inkomster över tid</h3>
          <Line data={incomeData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>

        {/* Diagram 5: Livslängdsdata */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Förväntad Livslängd</h3>
          <Bar data={lifeExpectancyData} options={{ indexAxis: "y", scales: { x: { beginAtZero: true, max: 100 } } }} />
        </div>

        {/* Diagram 6: Skolresultat */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Skolresultat</h3>
          <Bar data={schoolResultsData} options={{ scales: { y: { beginAtZero: true, max: 20 } } }} />
        </div>

        {/* Diagram 7: Bästa skolor */}
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Topp 3 Skolor</h3>
          <Bar data={topSchoolsData} options={{ scales: { y: { beginAtZero: true, max: 20 } } }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
