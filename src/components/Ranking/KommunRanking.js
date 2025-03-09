"use client";

import React, { useState } from "react";
import useKommunRanking from "./UseKommunRanking";
import KommunRankingTable from "./KommunRankingTable";
import Pagination from "./Pagination";

const KommunRankingPage = () => {
  const pageSize = 10; // Antal poster per sida
  const initialPage = 1; // Starta alltid från första sidan

  const [selectedYear, setSelectedYear] = useState(null); // Ingen initial vald år

  const {
    data,
    loading,
    currentPage,
    totalPages,
    setYear,
    setCurrentPage,
  } = useKommunRanking(null, initialPage, pageSize);

  // Hantera byte av år i dropdown
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setSelectedYear(newYear);
    setYear(newYear);
    setCurrentPage(1); // Återställ till första sidan vid byte av år
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      {/* <header className="bg-blue-600 text-white py-6 shadow-md">
        <h1 className="text-center text-3xl font-bold">Kommunranking</h1>
      </header> */}


<h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Kommuntrender
      </h1>

      {/* Content */}
      <main className="flex-1 container mx-auto p-6">
        <div className="mb-8">
          <label
            htmlFor="year-select"
            className="block text-lg font-semibold text-gray-700 mb-3"
          >
            Välj ett år för att visa rankning:
          </label>
          <select
            id="year-select"
            value={selectedYear || ""}
            onChange={handleYearChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              -- Välj ett år --
            </option>
            {[2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {!selectedYear && (
          <div className="text-center text-gray-500 mt-10">
            <p>Vänligen välj ett år för att visa rankningen.</p>
          </div>
        )}

        {selectedYear && loading && (
          <div className="flex justify-center items-center mt-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
          </div>
        )}

        {selectedYear && !loading && data.length > 0 && (
          <>
            <KommunRankingTable data={data} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {selectedYear && !loading && data.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <p>Ingen data hittades för det valda året.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white text-center py-3">
        <p>&copy; 2024 Kommunranking</p>
      </footer> */}
    </div>
  );
};

export default KommunRankingPage;
