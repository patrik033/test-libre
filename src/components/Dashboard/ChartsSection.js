import React from "react";
import { Pie, Bar, Line } from "react-chartjs-2";

const ChartsSection = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center text-gray-500">
        <p>Ingen data tillgänglig för diagram.</p>
      </div>
    );
  }

  const {
    propertySales = [],
    crimeDistribution = [],
    avgIncome = [],
    avgLifeExpectancy = {},
    schoolResultYearNine = [],
    topSchools = [],
  } = data;

  // Funktion för att hantera tomma dataset
  const createChartData = (labels, dataset) => ({
    labels: labels.length ? labels : ["Ingen data"],
    datasets: [
      {
        label: dataset.label,
        data: dataset.data.length ? dataset.data : [0],
        backgroundColor: dataset.backgroundColor || ["#CCCCCC"],
      },
    ],
  });

  const propertySalesData = createChartData(
    propertySales.map((item) => item.propertyType),
    {
      label: "Antal Försäljningar",
      data: propertySales.map((item) => item.salesCount),
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
    }
  );

  const crimeData = createChartData(
    crimeDistribution.map((item) => item.eventType),
    {
      label: "Antal Brott",
      data: crimeDistribution.map((item) => item.eventCount),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    }
  );

  const avgIncomeData = createChartData(
    avgIncome.map((item) => item.year),
    {
      label: "Genomsnittlig Inkomst (tkr)",
      data: avgIncome.map((item) => item.avgIncome),
      backgroundColor: "#4BC0C0",
    }
  );

  const lifeExpectancyData = createChartData(
    ["Män", "Kvinnor", "Totalt"],
    {
      label: "Förväntad Livslängd",
      data: [
        avgLifeExpectancy.male || 0,
        avgLifeExpectancy.female || 0,
        avgLifeExpectancy.total || 0,
      ],
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
    }
  );

  const schoolResultsData = createChartData(
    schoolResultYearNine.map((item) => item.subject),
    {
      label: "Snittbetyg för Årskurs 9",
      data: schoolResultYearNine.map((item) => item.averageGrade),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    }
  );

  const topSchoolsData = createChartData(
    topSchools.map((item) => item.schoolName),
    {
      label: "Betyg för bästa skolor",
      data: topSchools.map((item) => item.averageGrade),
      backgroundColor: ["#4BC0C0", "#9966FF", "#FFCE56"],
    }
  );

  return (
    <div className="charts-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Fastighetsförsäljningar */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Fastighetsförsäljningar</h3>
        <Pie data={propertySalesData} />
      </div>

      {/* Brottsfördelning */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Brottsfördelning</h3>
        <Bar data={crimeData} options={{ scales: { y: { beginAtZero: true } } }} />
      </div>

      {/* Inkomster över tid */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Inkomster över tid</h3>
        <Line data={avgIncomeData} options={{ scales: { y: { beginAtZero: true } } }} />
      </div>

      {/* Medellivslängd */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Medellivslängd</h3>
        <Bar
          data={lifeExpectancyData}
          options={{ indexAxis: "y", scales: { x: { beginAtZero: true, max: 100 } } }}
        />
      </div>

      {/* Skolresultat */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Skolresultat</h3>
        <Bar
          data={schoolResultsData}
          options={{ scales: { y: { beginAtZero: true, max: 20 } } }}
        />
      </div>

      {/* Topp 3 Skolor */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Topp 3 Skolor</h3>
        <Bar
          data={topSchoolsData}
          options={{ scales: { y: { beginAtZero: true, max: 20 } } }}
        />
      </div>
    </div>
  );
};

export default ChartsSection;
