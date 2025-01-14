// src/app/api/geoapify/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // 1) Hämta query-parametrar (id) från URL
    const { searchParams } = new URL(request.url);
    const countyId = searchParams.get('id') || '';

    // 2) Hämta den hemliga nyckeln från .env
    //    (OBS: ingen NEXT_PUBLIC_!)
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      throw new Error('Saknar GEOAPIFY_API_KEY i .env');
    }

    // 3) Anropa Geoapify (server-side cache med revalidate=3600)
    const geoapifyRes = await fetch(
      `https://api.geoapify.com/v1/boundaries/consists-of?id=${countyId}&geometry=geometry_1000&apiKey=${apiKey}`,
      {
        next: { revalidate: 3600 }, // Server-side revalidation i Next.js
      }
    );
    const data = await geoapifyRes.json();

    // 4) Exempel: kolla Gotland
    const gotlandExists = data.features?.some(
      (feature) => feature.properties.name === 'Gotlands län'
    );

    if (!gotlandExists) {
      const gotlandRes = await fetch('http://localhost:3000/gotland.json');
      const gotlandData = await gotlandRes.json();
      data.features.push(gotlandData.features[0]);
    }

    // 5) Sätt upp ett svar med Cache-Control för klienten
    const response = NextResponse.json(data);

    //    – Instruktion till webbläsare/CDN:
    //      public: Kan cachas av alla
    //      max-age=3600: Cacha i 1 timme
    //      stale-while-revalidate=86400: Efter 1 timme kan man leverera gammalt svar
    //                                    medan ett nytt hämtas i bakgrunden, upp till 24h
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400'
    );

    return response;
  } catch (error) {
    console.error('Fel i /api/geoapify:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
