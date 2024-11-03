"use client"

import Image from "next/image";
import { useState, useEffect } from 'react';
import MapComponent from "@/components/MapComponent";
import AnimatedMap from "@/components/AnimatedMap";
import MapBoundaries from "@/components/MapBoundaries";
export default function Home() {

  const [jsonData,setJsonData] = useState(null);

  useEffect(() => {
    // Hämta JSON-data från public-mappen
    fetch('/export.geojson')
      .then((response) => response.json())
      .then((data) => setJsonData(data))
      .catch((error) => console.error('Error loading JSON data:', error));
  }, []);

  if (!jsonData) return <p>Laddar data...</p>;
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Data från JSON-fil</h1>
      <div style={{width: "80%",height: "100%"}}>
        {/* <MapBoundaries/> */}
{/* <AnimatedMap/> */}
      <MapComponent/>
      </div>
      
    </div>
  );
}
