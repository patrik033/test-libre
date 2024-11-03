import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicGF0cmlrMDMzIiwiYSI6ImNsemZwYThzajE2Nm4ybHJ5ZWJtN2Z0dTYifQ.x1MLDVCyT30SdSjSj1P6JQ';
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

const SwedenCountyMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [isCountryView, setIsCountryView] = useState(true);
  const [isCountyView, setIsCountyView] = useState(false);
  const [isMunicipalityView, setIsMunicipalityView] = useState(false);
  const [currentCountyId, setCurrentCountyId] = useState(null);
  const [currentMunicipalityId, setCurrentMunicipalityId] = useState(null);
  const countyBoundariesData = useRef(null);
  const municipalityBoundariesData = useRef(null);

  const [markedMunicipalityName,setMarkedMunicipalityName] = useState(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [15.0, 61.0], // Centrerat över Sverige
      zoom: 5,
      maxZoom: 10,
      minZoom: 5,
    });

    mapRef.current = map;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on('load', async () => {
      await loadCountyBoundaries(map);

      // Hover för län
      map.on('mousemove', 'county-boundaries', (e) => {
        if (isCountryView) {
          const features = map.queryRenderedFeatures(e.point, { layers: ['county-boundaries'] });
          if (features.length) {
            const feature = features[0];
            map.getCanvas().style.cursor = 'pointer';
            popup.setLngLat(e.lngLat).setHTML(`<strong>${feature.properties.name}</strong>`).addTo(map);
          }
        }
      });

      map.on('mouseleave', 'county-boundaries', () => {
        if (isCountryView) {
          map.getCanvas().style.cursor = '';
          popup.remove();
        }
      });

      // Klickfunktion för att zooma in på ett län
      map.on('click', 'county-boundaries', (e) => {
        let countyId = e.features[0].properties.place_id;
        const [longitude, latitude] = e.lngLat.toArray();
        setCurrentCountyId(countyId);
        setIsCountryView(false);
        setIsCountyView(true);

        map.flyTo({
          center: [longitude, latitude],
          zoom: 8,
          speed: 1,
          curve: 1.2,
        });

        // Ta bort Sverigekartan och ladda in endast kommungränser för det valda länet
        map.setLayoutProperty('county-boundaries', 'visibility', 'none');
        map.setLayoutProperty('county-boundaries-outline', 'visibility', 'none');

        loadMunicipalities(map, countyId);

        // Lägg till hover-funktion för kommunnamn på länsnivå
        map.on('mousemove', 'municipality-boundaries', (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['municipality-boundaries'] });
          if (features.length) {
            const feature = features[0];
            map.getCanvas().style.cursor = 'pointer';
            popup.setLngLat(e.lngLat).setHTML(`<strong>${feature.properties.name}</strong>`).addTo(map);
          }
        });

        map.on('mouseleave', 'municipality-boundaries', () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });
      });
    });

    return () => map.remove();
  }, []);

  // Ladda Sveriges länsgränser
  const loadCountyBoundaries = async (map) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/boundaries/consists-of?id=5142d55085d8612e4059081227fc410e4f40f00101f90156ce000000000000c0020b92030753766572696765&geometry=geometry_1000&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();

      const countyNames = data.features.map(feature => feature.properties.name);

      if (countyNames !== "Gotlands län") {
        const responseGotland = await fetch('/gotland.json');
        const gotlandData = await responseGotland.json();
        console.log({ gotlandData, data })
        data.features.push(gotlandData.features[0])
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

  // Ladda kommungränser för valt län
  const loadMunicipalities = async (map, countyId) => {
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
  
        map.on('click', 'municipality-boundaries', (e) => {
          const municipalityId = e.features[0].properties.place_id;
          setCurrentMunicipalityId(municipalityId);
          setIsMunicipalityView(false);
  
          // Hämta data för enskild kommun från lokalt lagrad data
          const singleMunicipalityData = municipalityBoundariesData.current.features.find(
            (feature) => feature.properties.place_id === municipalityId
          );
          
          loadSingleMunicipality(map, singleMunicipalityData);
        });
      }
    } catch (error) {
      console.error('Fel vid hämtning av kommundata:', error);
    }
  };

  // Ladda enskild kommun från existerande data
  const loadSingleMunicipality = (map, singleMunicipalityData) => {
  // Kontrollera att singleMunicipalityData är definierat och har rätt format
  if (!singleMunicipalityData || !singleMunicipalityData.geometry) {
    console.error("Single municipality data saknas eller är ogiltigt:", singleMunicipalityData);
    return;
  }

  console.log(singleMunicipalityData.properties.name)
  if(singleMunicipalityData){
    setMarkedMunicipalityName(singleMunicipalityData.properties.name)
  }

  map.setLayoutProperty('municipality-boundaries', 'visibility', 'none');
  map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'none');

  if (map.getSource('single-municipality')) {
    map.getSource('single-municipality').setData(singleMunicipalityData);
  } else {
    map.addSource('single-municipality', {
      type: 'geojson',
      data: singleMunicipalityData,
    });

    map.addLayer({
      id: 'single-municipality-layer',
      type: 'line',
      source: 'single-municipality',
      paint: {
        'line-color': '#FF0000', // Gör den markerade kommunens gräns röd
        'line-width': 2,
      },
    });
  }
};

  // Återgå till länsnivå från kommun
  const goBackToCountyView = () => {
    setMarkedMunicipalityName(null)
    const map = mapRef.current;
    if (map) {
      setIsMunicipalityView(false);
      setIsCountyView(true);

      map.flyTo({
        center: map.getCenter(),
        zoom: 8,
      });

      map.setLayoutProperty('municipality-boundaries', 'visibility', 'visible');
      map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'visible');

      if (map.getSource('single-municipality')) {
        map.removeLayer('single-municipality-layer');
        map.removeSource('single-municipality');
      }
    }
  };

  // Återgå till Sverigekartan från län
  const goBackToCountryView = () => {
    setMarkedMunicipalityName(null)
    const map = mapRef.current;
    if (map) {
      setIsCountryView(true);
      setIsCountyView(false);

      map.flyTo({
        center: [15.0, 61.0],
        zoom: 5,
      });

      map.setLayoutProperty('county-boundaries', 'visibility', 'visible');
      map.setLayoutProperty('county-boundaries-outline', 'visibility', 'visible');

      if (map.getSource('municipalities')) {
        map.removeLayer('municipality-boundaries');
        map.removeLayer('municipality-boundaries-outline');
        map.removeSource('municipalities');
      }

      if (map.getSource('single-municipality')) {
        map.removeLayer('single-municipality-layer');
        map.removeSource('single-municipality');
      }
    }
  };

  return (
    <div>
      <div>
        {markedMunicipalityName}
      </div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '90vh' }} />
      {isMunicipalityView && (
        <button onClick={goBackToCountyView} style={{ position: 'absolute', top: 10, left: 10 }}>
          Återgå till länsnivå
        </button>
      )}
      {isCountyView && (
        <button onClick={goBackToCountryView} style={{ position: 'absolute', top: 50, left: 10 }}>
          Återgå till Sverigekartan
        </button>
      )}
    </div>
  );
};

export default SwedenCountyMap;
