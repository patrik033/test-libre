import React, { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import DashboardFilters from "../../components/UI/DashboardFilters"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [filters, setFilters] = useState({
    year: "2023",
    propertyType: "Alla",
  });

  // Exempeldata för bostadsförsäljningar per typ
  const propertySalesData = {
    labels: ['Lägenheter', 'Villor', 'Radhus'],
    datasets: [
      {
        label: 'Antal Försäljningar',
        data: [120, 80, 30],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  // Exempeldata för genomsnittliga priser
  const avgPriceData = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Genomsnittligt Pris (tusentals kr)',
        data: [2400, 2600, 2750, 3000, 3200],
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Exempeldata för brottsfördelning i kommunen
  const crimeData = {
    labels: ['Stöld', 'Våldsbrott', 'Skadegörelse', 'Bedrägeri'],
    datasets: [
      {
        label: 'Antal Brott',
        data: [300, 150, 120, 80],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Eventuell logik för att uppdatera diagramdata baserat på filtren
  };

  return (
    <div className="dashboard-container p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Statistik Dashboard (Exempeldata)</h2>

      {/* Filter Komponent */}
      <DashboardFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="charts-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Diagram för bostadsförsäljningar */} 
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Bostadsförsäljningar per Typ</h3>
          <Pie data={propertySalesData} />
        </div>

        {/* Diagram för genomsnittliga bostadspriser */} 
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Genomsnittligt Pris över Tid</h3>
          <Bar data={avgPriceData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>

        {/* Diagram för brottsfördelning */} 
        <div className="chart bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Brottsfördelning i Kommunen</h3>
          <Pie data={crimeData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
