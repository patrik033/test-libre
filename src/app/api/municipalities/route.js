// app/api/municipalities/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  const { countyId } = await request.json();
  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  try {
    let data;

    // Exempel: särskild logik för Gotland
    if (countyId === "51328cf5b565983240596486d4b7f1d24c40f00101f9016b2d110000000000c0020892030f476f746c616e6473206b6f6d6d756e") {
      const jsonPath = path.join(process.cwd(), 'public', 'gotland-kommun.json');
      const fileData = await fs.readFile(jsonPath, 'utf8');
      data = JSON.parse(fileData);
    } else {
      // Annars anropa Geoapify
      const response = await fetch(
        `https://api.geoapify.com/v1/boundaries/consists-of?id=${countyId}&geometry=geometry_1000&apiKey=${GEOAPIFY_API_KEY}`,{
          next: {revalidate: 3600}
        }
      );
      data = await response.json();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error loading municipalities data:", error);
    return NextResponse.json(
      { error: "Failed to load municipality data" },
      { status: 500 }
    );
  }
}
