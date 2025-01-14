// MapBoundaries.js
import mapboxgl from 'mapbox-gl';

// INGET "NEXT_PUBLIC_GEOAPIFY_API_KEY" längre!

export const loadCountyBoundaries = async (map, countyBoundariesData) => {
  try {
    // 1) Anropa VÅRT EGET endpoint, i stället för Geoapify direkt
    //    Skicka med "id" som query-param (ex: countyId eller fast hårdkodat)
    const response = await fetch(
      '/api/geoapify?id=5142d55085d8612e4059081227fc410e4f40f00101f90156ce000000000000c0020b92030753766572696765',{
        next: {revalidate: 3600}
      }
    );
    if (!response.ok) {
      throw new Error(`Kunde inte hämta countyBoundaries: ${response.status}`);
    }

    // 2) Hämta JSON-svaret
    const data = await response.json();

    // 3) Spara data i ref
    countyBoundariesData.current = data;

    // 4) Lägg till källan i kartan
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

    // 5) Popup- och hover-effekt
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

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
    console.error('Fel vid hämtning av countyBoundaries:', error);
  }
};
