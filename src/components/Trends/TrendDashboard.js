"use client";

import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const TrendDashboard = ({ kommunId, years }) => {
  const [trendData, setTrendData] = useState([]);
  const [trendInsights, setTrendInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculatePercentageChange = (newVal, oldVal) => {
    if (oldVal === 0 || isNaN(oldVal)) return null; // Undvik division med 0
    return ((newVal - oldVal) / oldVal) * 100;
  };

  const formatValue = (value) => (typeof value === "number" && !isNaN(value) ? value.toFixed(2) : "Ingen data");

  const fillMissingYears = (data, years) => {
    const filledData = years.map((year) => {
      const existingYearData = data.find((item) => item.year === year);
      return (
        existingYearData || {
          year: year,
          lifeTime: null,
          averageAge: null,
          totalSales: null,
          avgSalesValue: null,
          salesCount: null,
          crimes: {},
          schoolResultsYearNine: null,
          schoolResultsYearSix: null,
        }
      );
    });
    return filledData;
  };

  const generateInsights = (data) => {
    const insights = [];
    const focusCrimes = ["Rån", "Mord/dråp", "Mord/dråp, försök"];

    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const current = data[i];

      if (!prev || !current) continue; // Hoppa över om data saknas

      // Crime insights
      const crimeChanges = focusCrimes.map((crime) => {
        const prevValue = prev.crimes[crime] || 0;
        const currValue = current.crimes[crime] || 0;
        return {
          type: crime,
          change: calculatePercentageChange(currValue, prevValue),
        };
      });

      const totalCrimesChange = calculatePercentageChange(
        Object.values(current.crimes).reduce((sum, val) => sum + (val || 0), 0),
        Object.values(prev.crimes).reduce((sum, val) => sum + (val || 0), 0)
      );

      const relevantCrimeInsight =
        crimeChanges.some((c) => c.change !== null)
          ? crimeChanges.filter((c) => c.change !== null)
          : [{ type: "Alla brott", change: totalCrimesChange }];

      insights.push({
        yearRange: `${prev.year} - ${current.year}`,
        lifeTime: calculatePercentageChange(current.lifeTime, prev.lifeTime),
        averageAge: calculatePercentageChange(current.averageAge, prev.averageAge),
        totalSales: calculatePercentageChange(current.totalSales, prev.totalSales),
        avgSalesValue: calculatePercentageChange(current.avgSalesValue, prev.avgSalesValue),
        schoolResultsYearNine: calculatePercentageChange(
          current.schoolResultsYearNine,
          prev.schoolResultsYearNine
        ),
        schoolResultsYearSix: calculatePercentageChange(
          current.schoolResultsYearSix,
          prev.schoolResultsYearSix
        ),
        crimeInsights: relevantCrimeInsight,
      });
    }
    return insights;
  };

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        setError(null);
        const requestBody = { kommunId, year: years };
        const response = await fetch(`https://localhost:7150/api/trends/compare`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) throw new Error("Kunde inte hämta trenddata.");

        const rawData = await response.json();
        const sortedData = rawData.sort((a, b) => a.year - b.year); // Sortera i stigande ordning
        const filledData = fillMissingYears(sortedData, years); // Fyll tomma år
        setTrendData(filledData);
        setTrendInsights(generateInsights(filledData));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [kommunId, years]);

  if (loading) return <div>Laddar trenddata...</div>;
  if (error) return <div>Fel: {error}</div>;
  if (!trendData || trendData.length === 0) return <div>Ingen trenddata tillgänglig.</div>;

  const yearsLabels = trendData.map((item) => item.year);

  const lifeExpectancyData = {
    labels: yearsLabels,
    datasets: [
      {
        label: "Medellivslängd",
        data: trendData.map((item) => item.lifeTime),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54,162,235,0.5)",
        borderWidth: 2,
      },
    ],
  };

  const averageAgeData = {
    labels: yearsLabels,
    datasets: [
      {
        label: "Medelålder",
        data: trendData.map((item) => item.averageAge),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255,99,132,0.5)",
        borderWidth: 2,
      },
    ],
  };

  const realEstateSalesData = {
    labels: yearsLabels,
    datasets: [
      {
        label: "Totala Försäljningar",
        data: trendData.map((item) => item.totalSales),
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Genomsnittligt Försäljningsvärde (Mkr)",
        data: trendData.map((item) => item.avgSalesValue / 1_000_000),
        backgroundColor: "#FFCE56",
      },
    ],
  };

  const crimeData = {
    labels: yearsLabels,
    datasets: Object.keys(trendData[0]?.crimes || {}).map((crimeType, index) => ({
      label: crimeType,
      data: trendData.map((item) => item.crimes[crimeType] || 0),
      backgroundColor: `hsl(${index * 40}, 70%, 50%)`,
    })),
  };

  const schoolResultsData = {
    labels: yearsLabels,
    datasets: [
      {
        label: "Årskurs 9 - Medelbetyg",
        data: trendData.map((item) => item.schoolResultsYearNine),
        backgroundColor: "#9966FF",
      },
      {
        label: "Årskurs 6 - Medelbetyg",
        data: trendData.map((item) => item.schoolResultsYearSix),
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <div className="trend-dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Medellivslängd</h3>
        <Line data={lifeExpectancyData} options={{ responsive: true }} />
        {trendInsights.map((trend, index) => (
          <p key={index} className="text-sm text-gray-600">
            {trend.yearRange}: Livslängden förändrades med {formatValue(trend.lifeTime)}%
          </p>
        ))}
      </div>
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Medelålder</h3>
        <Line data={averageAgeData} options={{ responsive: true }} />
        {trendInsights.map((trend, index) => (
          <p key={index} className="text-sm text-gray-600">
            {trend.yearRange}: Medelåldern förändrades med {formatValue(trend.averageAge)}%
          </p>
        ))}
      </div>
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Fastighetsförsäljningar</h3>
        <Bar data={realEstateSalesData} options={{ responsive: true }} />
        {trendInsights.map((trend, index) => (
          <p key={index} className="text-sm text-gray-600">
            {trend.yearRange}: Totala försäljningar förändrades med{" "}
            {formatValue(trend.totalSales)}% och genomsnittligt värde med{" "}
            {formatValue(trend.avgSalesValue)}%
          </p>
        ))}
      </div>
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Brottsfördelning</h3>
        <Bar data={crimeData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
        {trendInsights.map((trend, index) => (
          <p key={index} className="text-sm text-gray-600">
            {trend.yearRange}: Brottstyper{" "}
            {trend.crimeInsights.map((crime) => `${crime.type}: ${formatValue(crime.change)}%`).join(", ")}
          </p>
        ))}
      </div>
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Skolresultat</h3>
        <Bar data={schoolResultsData} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 20 } } }} />
        {trendInsights.map((trend, index) => (
          <p key={index} className="text-sm text-gray-600">
            {trend.yearRange}: Årskurs 9 betyg förändrades med{" "}
            {formatValue(trend.schoolResultsYearNine)}%, Årskurs 6 med{" "}
            {formatValue(trend.schoolResultsYearSix)}%
          </p>
        ))}
      </div>
    </div>
  );
};

export default TrendDashboard;
