// MapBoundaries.js
import mapboxgl from 'mapbox-gl';//
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

export const loadCountyBoundaries = async (map, countyBoundariesData) => {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/boundaries/consists-of?id=5142d55085d8612e4059081227fc410e4f40f00101f90156ce000000000000c0020b92030753766572696765&geometry=geometry_1000&apiKey=${GEOAPIFY_API_KEY}`
    );
    const data = await response.json();

   

    // Om Gotland saknas, lägg till Gotlands-data separat
    if (!data.features.some(feature => feature.properties.name === "Gotlands län")) {
      const responseGotland = await fetch('/gotland.json');
      const gotlandData = await responseGotland.json();
      data.features.push(gotlandData.features[0]);
    }

    // Spara data till countyBoundariesData-referensen
    countyBoundariesData.current = data;

    // Lägg till source och layer för länsgränser på kartan
    map.addSource('county-boundaries', {
      type: 'geojson',
      data,
    });

    map.addLayer({
      id: 'county-boundaries',
      type: 'fill',
      source: 'county-boundaries',
      paint: {
        'fill-color': '#888888',
        'fill-opacity': 0.4,
      },
    });

    map.addLayer({
      id: 'county-boundaries-outline',
      type: 'line',
      source: 'county-boundaries',
      paint: {
        'line-color': '#000000',
        'line-width': 1,
      },
    });

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
  
      // Lägg till hover-effekt för län
      map.on('mousemove', 'county-boundaries', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['county-boundaries'] });
        if (features.length) {
          const feature = features[0];
          map.getCanvas().style.cursor = 'pointer';
          popup.setLngLat(e.lngLat).setHTML(`<strong>${feature.properties.name}</strong>`).addTo(map);
        }
      });
  
      map.on('mouseleave', 'county-boundaries', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
  } catch (error) {
    console.error('Fel vid hämtning av länsdata:', error);
  }
};
