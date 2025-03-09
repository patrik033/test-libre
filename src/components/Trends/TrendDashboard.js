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

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
);

const TrendDashboard = ({ kommunId, years }) => {
  const [trendData, setTrendData] = useState([]);
  const [trendInsights, setTrendInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Oforändrad logik för att räkna procent
  const calculatePercentageChange = (newVal, oldVal) => {
    if (oldVal === 0 || isNaN(oldVal)) return null;
    return ((newVal - oldVal) / oldVal) * 100;
  };

  // Ny hjälp-funktion för att ge rätt text
  const interpretChange = (changeValue, subject) => {
    if (changeValue === null || isNaN(changeValue)) {
      return `${subject} saknar data för det här intervallet`;
    }
    if (changeValue === 0) {
      return `${subject} är oförändrad`;
    }
    const sign = changeValue > 0 ? "+" : "";
    return `${subject} ändrades med ${sign}${changeValue.toFixed(2)}%`;
  };

  // Oförändrad: fyll tomma år
  const fillMissingYears = (data, years) => {
    // Sortera years i stigande ordning
    const sortedYears = [...years].sort((a, b) => a - b);

    return sortedYears.map((year) => {
      const existingYearData = data.find((item) => item.year === year);
      return (
        existingYearData || {
          year,
          lifeTime: null,
          averageAge: null,
          totalSales: null,
          avgSalesValue: null,
          // ...
        }
      );
    });
  };

  //Uppdaterad: loopar i stigande ordning
  const generateInsights = (data) => {
    const insights = [];
  
    for (let i = 0; i < data.length - 1; i++) {
      const current = data[i];
      const next = data[i + 1];
      if (!current || !next) continue;
  
      const focusCrimes = Object.keys(current.crimes || {});
  
      // Beräkna förändringar för varje brottstyp
      const crimeChanges = focusCrimes.map((crime) => {
        const currValue = current.crimes[crime] || 0;
        const nextValue = next.crimes[crime] || 0;
  
        return {
          type: crime,
          change: currValue === 0 && nextValue === 0
            ? null
            : calculatePercentageChange(nextValue, currValue),
        };
      });
  
      // Filtrera bort brottstyper utan förändringar och sortera efter störst förändring
      const sortedCrimes = crimeChanges
        .filter((c) => c.change !== null)
        .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  
      // Välj den brottstyp med störst förändring
      const topCrimeChange = sortedCrimes.length > 0 ? sortedCrimes[0] : null;
  
      // Beräkna total förändring för alla brott
      const totalCrimesCurrent = Object.values(current.crimes || {}).reduce((sum, val) => sum + (val || 0), 0);
      const totalCrimesNext = Object.values(next.crimes || {}).reduce((sum, val) => sum + (val || 0), 0);
  
      const totalCrimesChange = totalCrimesCurrent === 0 && totalCrimesNext === 0
        ? null
        : calculatePercentageChange(totalCrimesNext, totalCrimesCurrent);
  
      insights.push({
        yearRange: `${current.year} - ${next.year}`,
        lifeTime: calculatePercentageChange(next.lifeTime, current.lifeTime),
        averageAge: calculatePercentageChange(next.averageAge, current.averageAge),
        totalSales: calculatePercentageChange(next.totalSales, current.totalSales),
        avgSalesValue: calculatePercentageChange(next.avgSalesValue, current.avgSalesValue),
        schoolResultsYearNine: calculatePercentageChange(next.schoolResultsYearNine, current.schoolResultsYearNine),
        schoolResultsYearSix: calculatePercentageChange(next.schoolResultsYearSix, current.schoolResultsYearSix),
        crimeInsights: topCrimeChange
          ? [{ type: topCrimeChange.type, change: topCrimeChange.change }]
          : [{ type: "Alla brott", change: totalCrimesChange }],
      });
    }
  
    return insights;
  };
  
  

  // Oförändrat: hämta data
  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        setError(null);
        const requestBody = { kommunId, year: years };
        const response = await fetch("https://localhost:7150/api/trends/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) throw new Error("Kunde inte hämta trenddata.");

        const rawData = await response.json();
        const dataExtracted = rawData.data;
   
        const sortedData = dataExtracted.sort((a, b) => a.year - b.year); // stigande ordning
        const filledData = fillMissingYears(sortedData, years);

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

  // Oförändrad: chart-data
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
        label: "Totala försäljningar",
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

  const filterDataWithCrimes = (data) => {
    return data.filter((yearData) => {
      return yearData.crimes && Object.keys(yearData.crimes).length > 0;
    });
  };
  const crimeFilteredData = filterDataWithCrimes(trendData);

  const crimeData = {
    labels: crimeFilteredData.map((item) => item.year), // Endast år med brottsdata
    datasets: Object.keys(crimeFilteredData[0]?.crimes || {}).map((crimeType, index) => ({
      label: crimeType,
      data: crimeFilteredData.map((item) => item.crimes[crimeType] || 0),
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



  //console.log("Crime Data Datasets:", crimeData);
  // Endast texten under varje chart är förändrad
  return (
    <div className="trend-dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* ---- 1: Medellivslängd ---- */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Medellivslängd</h3>
        <Line data={lifeExpectancyData} options={{ responsive: true }} />

        <div className="mt-2 space-y-1">
          {trendInsights.map((trend, i) => (
            <p key={i} className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">
                {trend.yearRange}
              </span>
              : {interpretChange(trend.lifeTime, "livslängden")}
            </p>
          ))}
        </div>
      </div>

      {/* ---- 2: Medelålder ---- */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Medelålder</h3>
        <Line data={averageAgeData} options={{ responsive: true }} />

        <div className="mt-2 space-y-1">
          {trendInsights.map((trend, i) => (
            <p key={i} className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">
                {trend.yearRange}
              </span>
              : {interpretChange(trend.averageAge, "medelåldern")}
            </p>
          ))}
        </div>
      </div>

      {/* ---- 3: Fastighetsförsäljningar ---- */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Fastighetsförsäljningar</h3>
        <Bar data={realEstateSalesData} options={{ responsive: true }} />

        <div className="mt-2 space-y-1">
          {trendInsights.map((trend, i) => (
            <p key={i} className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">
                {trend.yearRange}
              </span>
              : totala försäljningar{" "}
              {interpretChange(trend.totalSales, "är")}
              {" och "}
              {interpretChange(trend.avgSalesValue, "genomsnittsvärdet")}
            </p>
          ))}
        </div>
      </div>

      {/* ---- 4: Brottsfördelning ---- */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Brottsfördelning</h3>
        <Bar data={crimeData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />

        <div className="mt-2 space-y-1">
          {trendInsights.map((trend, i) => (
            <p key={i} className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">
                {trend.yearRange}
              </span>
              : brottstyper{" "}
              {trend.crimeInsights.map((crime, j) => (
                <span key={j}>
                  <span
                    className="font-bold"
                    style={{
                      color: `hsl(${(j * 60) % 360}, 70%, 50%)`, // Dynamiskt genererad färg för crime.type
                    }}
                  >
                    {crime.type}
                  </span>
                  : {interpretChange(crime.change, "")}
                  {j < trend.crimeInsights.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          ))}
        </div>


      </div>

      {/* ---- 5: Skolresultat ---- */}
      <div className="chart bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Skolresultat</h3>
        <Bar
          data={schoolResultsData}
          options={{ responsive: true, scales: { y: { beginAtZero: true, max: 20 } } }}
        />

        <div className="mt-2 space-y-1">
          {trendInsights.map((trend, i) => (
            <p key={i} className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">
                {trend.yearRange}
              </span>
              : åk9-betyg {interpretChange(trend.schoolResultsYearNine, "")},{" "}
              åk6 {interpretChange(trend.schoolResultsYearSix, "")}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendDashboard;
