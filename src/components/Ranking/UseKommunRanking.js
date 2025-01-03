"use client";

import { useState, useEffect } from "react";

const useKommunRanking = (initialYear, initialPage, pageSize) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [year, setYear] = useState(initialYear);

  const fetchRanking = async (page = 1) => {
    if (!year) return; // Ladda inte data om inget år är valt

    setLoading(true);
    try {
      const response = await fetch(
        `https://localhost:7150/api/trends/ranking?year=${year}&currentPage=${page}&pageSize=${pageSize}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result.items);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);


 
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (year) {
      fetchRanking(currentPage); // Ladda data när år eller sida ändras
    }
  }, [year, currentPage]);



  return {
    data,
    loading,
    currentPage,
    totalPages,
    setYear,
    setCurrentPage,
    fetchRanking,
  };
};

export default useKommunRanking;
