import React from "react";
import { Pie, Bar, Line } from "react-chartjs-2";

const ChartsSection = ({ data }) => {
  if (!data) return null;

  const {
    propertySales = [],
    crimeDistribution = [],
    avgIncome = [],
    avgLifeExpectancy = {},
    schoolResultYearNine = [],
    topSchools = [],
  } = data;

  const propertySalesData = {
    labels: propertySales.map((item) => item.propertyType),
    datasets: [
      {
        label: "Antal Försäljningar",
        data: propertySales.map((item) => item.salesCount),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const crimeData = {
    labels: crimeDistribution.map((item) => item.eventType),
    datasets: [
      {
        label: "Antal Brott",
        data: crimeDistribution.map((item) => item.eventCount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const avgIncomeData = {
    labels: avgIncome.map((item) => item.year),
    datasets: [
      {
        label: "Genomsnittlig Inkomst (tkr)",
        data: avgIncome.map((item) => item.avgIncome),
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  const lifeExpectancyData = {
    labels: ["Män", "Kvinnor", "Totalt"],
    datasets: [
      {
        label: "Förväntad Livslängd",
        data: [
          avgLifeExpectancy.male,
          avgLifeExpectancy.female,
          avgLifeExpectancy.total,
        ],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const schoolResultsData = {
    labels: schoolResultYearNine.map((item) => item.subject),
    datasets: [
      {
        label: "Snittbetyg för Årskurs 9",
        data: schoolResultYearNine.map((item) => item.averageGrade),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const topSchoolsData = {
    labels: topSchools.map((item) => item.schoolName),
    datasets: [
      {
        label: "Betyg för bästa skolor",
        data: topSchools.map((item) => item.averageGrade),
        backgroundColor: ["#4BC0C0", "#9966FF", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="charts-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Fastighetsförsäljningar</h3>
        <Pie data={propertySalesData} />
      </div>
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Brottsfördelning</h3>
        <Bar data={crimeData} options={{ scales: { y: { beginAtZero: true } } }} />
      </div>
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Inkomster över tid</h3>
        <Line data={avgIncomeData} options={{ scales: { y: { beginAtZero: true } } }} />
      </div>
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Medellivslängd</h3>
        <Bar
          data={lifeExpectancyData}
          options={{ indexAxis: "y", scales: { x: { beginAtZero: true, max: 100 } } }}
        />
      </div>
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Skolresultat</h3>
        <Bar data={schoolResultsData} options={{ scales: { y: { beginAtZero: true, max: 20 } } }} />
      </div>
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Topp 3 Skolor</h3>
        <Bar data={topSchoolsData} options={{ scales: { y: { beginAtZero: true, max: 20 } } }} />
      </div>
    </div>
  );
};

export default ChartsSection;
