// MapLoader.js
export const loadCountyBoundaries = async (map, countyBoundariesData, GEOAPIFY_API_KEY) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/boundaries/consists-of?id=5142d55085d8612e4059081227fc410e4f40f00101f90156ce000000000000c0020b92030753766572696765&geometry=geometry_1000&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
  
      if (!data.features.some(feature => feature.properties.name === "Gotlands län")) {
        const responseGotland = await fetch('/gotland.json');
        const gotlandData = await responseGotland.json();
        data.features.push(gotlandData.features[0]);
      }
  
      countyBoundariesData.current = data;
  
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
    } catch (error) {
      console.error('Fel vid hämtning av länsdata:', error);
    }
  };
  
  export const loadMunicipalities = async (map, countyId, municipalityBoundariesData, GEOAPIFY_API_KEY) => {
    try {
      let data;
      if (countyId === "51328cf5b565983240596486d4b7f1d24c40f00101f9016b2d110000000000c0020892030f476f746c616e6473206b6f6d6d756e") {
        const response = await fetch("/gotland-kommun.json");
        data = await response.json();
      } else {
        const response = await fetch(
          `https://api.geoapify.com/v1/boundaries/consists-of?id=${countyId}&geometry=geometry_1000&apiKey=${GEOAPIFY_API_KEY}`
        );
        data = await response.json();
      }
  
      municipalityBoundariesData.current = data;
  
      map.setLayoutProperty('county-boundaries', 'visibility', 'none');
      map.setLayoutProperty('county-boundaries-outline', 'visibility', 'none');
  
      if (map.getSource('municipalities')) {
        map.getSource('municipalities').setData(data);
      } else {
        map.addSource('municipalities', {
          type: 'geojson',
          data,
        });
  
        map.addLayer({
          id: 'municipality-boundaries',
          type: 'fill',
          source: 'municipalities',
          paint: {
            'fill-color': '#FFD700',
            'fill-opacity': 0.4,
          },
        });
  
        map.addLayer({
          id: 'municipality-boundaries-outline',
          type: 'line',
          source: 'municipalities',
          paint: {
            'line-color': '#333333',
            'line-width': 1,
          },
        });
      }
    } catch (error) {
      console.error('Fel vid hämtning av kommundata:', error);
    }
  };
  
  export const showSelectedMunicipalityBoundary = (map, municipalityFeature) => {
    const municipalityBoundary = {
      type: "FeatureCollection",
      features: [municipalityFeature],
    };
  
    if (!map.getSource("selected-municipality")) {
      map.addSource("selected-municipality", {
        type: "geojson",
        data: municipalityBoundary,
      });
  
      map.addLayer({
        id: "selected-municipality-boundary",
        type: "line",
        source: "selected-municipality",
        paint: {
          "line-color": "#FF0000",
          "line-width": 2,
        },
      });
    } else {
      map.getSource("selected-municipality").setData(municipalityBoundary);
    }
  };
  