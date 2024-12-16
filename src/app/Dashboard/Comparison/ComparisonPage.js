"use client";

import React, { useState } from "react";
import { kommuner } from "../Kommuner";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { FaPercentage } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonPage = () => {
  const [selectedMunicipality1, setSelectedMunicipality1] = useState("");
  const [selectedMunicipality2, setSelectedMunicipality2] = useState("");
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [loadedParameters, setLoadedParameters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  const parameters = [
    { id: 0, value: "SchoolResults", label: "Skolresultat" },
    { id: 1, value: "PropertySales", label: "Fastighetsförsäljningar" },
    { id: 2, value: "TotalSales", label: "Totala försäljningar" },
    { id: 3, value: "TotalCrimes", label: "Totala brott" },
    { id: 4, value: "AvgIncome", label: "Genomsnittlig inkomst" },
    { id: 5, value: "AvgLifeExpectancy", label: "Förväntad livslängd" },
  ];

  const getMunicipalityName = (id) => {
    const municipality = kommuner.find((k) => k.Kommun === id);
    return municipality ? municipality.Kommunnamn : "Okänd Kommun";
  };

  const handleFetchComparison = async () => {
    if (!selectedMunicipality1 || !selectedMunicipality2 || selectedParameters.length === 0) {
      setError("Vänligen välj två kommuner och minst en parameter.");
      return;
    }
    setError("");
    setLoading(true);
    setComparisonResults([]);
    setLoadedParameters([]);
    setShowResults(false);

    const requestBody = {
      municipality1: selectedMunicipality1,
      municipality2: selectedMunicipality2,
      parameters: selectedParameters,
    };

    try {
      const response = await fetch("https://localhost:7150/api/comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      setComparisonResults(data);
      setLoadedParameters([...selectedParameters]);
      setShowResults(true);
    } catch (err) {
      console.error("Error fetching comparison data:", err);
      setError("Kunde inte hämta jämförelsedata. Försök igen senare.");
    } finally {
      setLoading(false);
    }
  };

  const handleMunicipalityChange = (setter, value) => {
    setter(value);
    setComparisonResults([]);
    setLoadedParameters([]);
    setShowResults(false);
  };

  return (
    <div className="comparison-dashboard px-4 md:px-8 bg-gray-100 text-gray-800 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Jämförelse mellan kommuner</h1>

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 max-w-5xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Kommun 1</label>
          <select
            className="w-full bg-white border border-gray-300 text-gray-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedMunicipality1}
            onChange={(e) => handleMunicipalityChange(setSelectedMunicipality1, e.target.value)}
          >
            <option value="">-- Välj Kommun --</option>
            {kommuner
              .filter((k) => k.Kommun !== selectedMunicipality2)
              .map((k) => (
                <option key={k.Kommun} value={k.Kommun}>
                  {k.Kommunnamn}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Kommun 2</label>
          <select
            className="w-full bg-white border border-gray-300 text-gray-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedMunicipality2}
            onChange={(e) => handleMunicipalityChange(setSelectedMunicipality2, e.target.value)}
          >
            <option value="">-- Välj Kommun --</option>
            {kommuner
              .filter((k) => k.Kommun !== selectedMunicipality1)
              .map((k) => (
                <option key={k.Kommun} value={k.Kommun}>
                  {k.Kommunnamn}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Parametrar</label>
          <div className="flex flex-wrap gap-2">
            {parameters.map((param) => (
              <label
                key={param.id}
                className="flex items-center bg-white text-gray-700 px-3 py-1 rounded cursor-pointerhover:text-blue-600"
              >
                <input
                  type="checkbox"
                  className="mr-2 border-gray-300 rounded "
                  checked={selectedParameters.includes(param.id)}
                  onChange={() =>
                    setSelectedParameters((prev) =>
                      prev.includes(param.id) ? prev.filter((id) => id !== param.id) : [...prev, param.id]
                    )
                  }
                />
                {param.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleFetchComparison}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:bg-gray-600"
          disabled={!selectedMunicipality1 || !selectedMunicipality2 || selectedParameters.length === 0}
        >
          Jämför
        </button>
      </div>

      {/* Diagram och Procentuell Skillnad */}
      {showResults && (
        <div className="space-y-8 max-w-6xl mx-auto">
          {loadedParameters.map((paramId) => {
            const param = parameters.find((p) => p.id === paramId);
            const resultsForParameter = comparisonResults.filter((r) => r.parameter === param.value);

            const chartData = {
              labels: resultsForParameter.map((result) => result.fieldName || "Okänt"),
              datasets: [
                {
                  label: `${getMunicipalityName(selectedMunicipality1)}`,
                  data: resultsForParameter.map((r) => r.value1),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
                {
                  label: `${getMunicipalityName(selectedMunicipality2)}`,
                  data: resultsForParameter.map((r) => r.value2),
                  backgroundColor: "rgba(153, 102, 255, 0.6)",
                },
              ],
            };

            return (
              <div key={param.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold mb-4">{param.label}</h2>
                <div className="h-[400px]">
                  <Bar data={chartData} options={{ responsive: true }} />
                </div>
                <div className="mt-4 text-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-center">Procentuell skillnad</h3>
                  <ul className="text-sm space-y-1">
                    {resultsForParameter.map((result, index) => (
                      <li
                        key={index}
                        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm md:text-base"
                      >
                        <FaPercentage className="text-green-500" />
                        <span>
                          <strong>{getMunicipalityName(selectedMunicipality1)}</strong> hade{" "}
                          <strong
                            className={
                              result.percentageDifference > 0 ? "text-green-500" : "text-red-500"
                            }
                          >
                            {result.percentageDifference > 0 ? "högre" : "lägre"}
                          </strong>{" "}
                          värde med{" "}
                        </span>
                        <span className="font-bold">{result.percentageDifference.toFixed(2)}%</span>
                        <span>
                          än <strong>{getMunicipalityName(selectedMunicipality2)}</strong> för{" "}
                          <strong>{result.fieldName}</strong>.
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;
