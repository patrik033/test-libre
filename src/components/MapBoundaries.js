import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import createNoisePollutionGeoJSON from './CreateHeatMapJson';

mapboxgl.accessToken = 'pk.eyJ1IjoicGF0cmlrMDMzIiwiYSI6ImNsemZwYThzajE2Nm4ybHJ5ZWJtN2Z0dTYifQ.x1MLDVCyT30SdSjSj1P6JQ';
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

const SWEDEN_BOUNDS = [
  [10.371094, 55.603178], [24.038086, 69.162558]
  // Nordost (t.ex. Norrbotten)
];

const SwedenCountyMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [isCountryView, setIsCountryView] = useState(true);
  const [isCountyView, setIsCountyView] = useState(false);
  const [isMunicipalityView, setIsMunicipalityView] = useState(false);
  const [currentCountyId, setCurrentCountyId] = useState(null);
  const [currentMunicipalityId, setCurrentMunicipalityId] = useState(null);
  const [markedMunicipalityName, setMarkedMunicipalityName] = useState(null);
  const countyBoundariesData = useRef(null);
  const municipalityBoundariesData = useRef(null);

  const [selectedDataType, setSelectedDataType] = useState(""); // För att hålla koll på vald datatyp
  const [showFilterOptions, setShowFilterOptions] = useState(false); // För att visa filtret baserat på vald typ

  const [isNoiseFilterChecked, setIsNoiseFilterChecked] = useState(false);
  const [isPropertyDataChecked, setIsPropertyDataChecked] = useState(false);


  // Filter för bullerdata
  const [roadFilter, setRoadFilter] = useState({
    motorway: true,
    trunk: true,
    primary: true,
    secondary: true,
    tertiary: true,
    default: true,
  });
  const [showRailway, setShowRailway] = useState(true);
  const [showIndustry, setShowIndustry] = useState(true);
  const [showSchools, setShowSchools] = useState(true);

  const toggleRoadFilter = (type) => {
    setRoadFilter((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      //center: [15.0, 61.0],
      //zoom: 5,
      //maxZoom: 10,
      //minZoom: 5,
      maxBounds: SWEDEN_BOUNDS
    });

    mapRef.current = map;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on('load', async () => {
      // map.fitBounds(SWEDEN_BOUNDS,{
      //   padding: 20
      // });
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
      map.on('click', 'county-boundaries', async (e) => {
        let countyId = e.features[0].properties.place_id;
        const countyBounds = e.features[0].geometry;  // Hämta geometrin för länet
        console.log(countyBounds)
        setCurrentCountyId(countyId);
        setIsCountryView(false);
        setIsCountyView(true);

        // Använd fitBounds för att centrera länet på kartan
        map.fitBounds(getFeatureBounds(countyBounds), {
          padding: 20,
          maxZoom: 8,
        });

        map.setLayoutProperty('county-boundaries', 'visibility', 'none');
        map.setLayoutProperty('county-boundaries-outline', 'visibility', 'none');

        await loadMunicipalities(map, countyId);
      });
    });

    return () => map.remove();
  }, []);

  const getFeatureBounds = (geometry) => {
    let coordinates = [];

    // Kontrollera om geometrin är en multipolygon eller en enkel polygon
    if (geometry.type === 'Polygon') {
      coordinates = geometry.coordinates[0];
    } else if (geometry.type === 'MultiPolygon') {
      // Om multipolygon, samla alla koordinater från alla delpolygoner
      geometry.coordinates.forEach((polygon) => {
        coordinates = coordinates.concat(polygon[0]);
      });
    } else {
      console.warn("Okänd geometri för länet:", geometry.type);
      return null;
    }

    // Extrahera latituder och longituder
    const lats = coordinates.map(coord => coord[1]);
    const lngs = coordinates.map(coord => coord[0]);

    // Beräkna gränser (sydväst och nordost)
    return [
      [Math.min(...lngs), Math.min(...lats)],  // Sydväst
      [Math.max(...lngs), Math.max(...lats)],  // Nordost
    ];
  };

  const loadCountyBoundaries = async (map) => {
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

  const loadMunicipalities = async (map, countyId) => {
    console.log(countyId)
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

        // Markera en kommun utan att ladda data direkt
        map.on('click', 'municipality-boundaries', async (e) => {
          const municipalityId = e.features[0].properties.place_id;
          const municipalityName = e.features[0].properties.name;

          setCurrentMunicipalityId(municipalityId);
          setMarkedMunicipalityName(municipalityName);
          setIsMunicipalityView(true);

          // Zooma in på vald kommun men ladda ingen data ännu
          const municipalityBounds = getFeatureBounds(e.features[0].geometry);
          map.fitBounds(municipalityBounds, {
            padding: 20,
            maxZoom: 12,
          });
        });
      }
    } catch (error) {
      console.error('Fel vid hämtning av kommundata:', error);
    }
  };

  useEffect(() => {
    // Om checkboxen för bullerdata är markerad och Eskilstuna kommun är vald, ladda bullerdatan
    if (isNoiseFilterChecked && markedMunicipalityName === "Eskilstuna kommun") {
      loadNoisePollutionData(mapRef.current, currentMunicipalityId, markedMunicipalityName);
    }
  }, [isNoiseFilterChecked, currentMunicipalityId, markedMunicipalityName]);

  const loadNoisePollutionData = async (map, municipalityId, municipalityName) => {
    try {
      console.log(`Laddar bullerdata för: ${municipalityName}`);
      const response = await fetch('/export.geojson'); // Eskilstunas bullerdata
      const rawData = await response.json();
      const noiseGeoJSON = createNoisePollutionGeoJSON(rawData);

      if (map.getSource('noise-data')) {
        map.getSource('noise-data').setData(noiseGeoJSON);
      } else {
        map.addSource('noise-data', { type: 'geojson', data: noiseGeoJSON });
        addNoiseLayers(map);
      }

      // Döljer kommun- och länslager för att framhäva bullerdata
      map.setLayoutProperty('municipality-boundaries', 'visibility', 'none');
      map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'none');
    } catch (error) {
      console.error('Error loading noise data:', error);
    }
  };

  const addNoiseLayers = (map) => {
    // Roads
    map.addLayer({
      id: 'road-layer',
      type: 'line',
      source: 'noise-data',
      filter: createRoadFilter(),
      paint: {
        'line-width': [
          'interpolate',
          ['linear'],
          ['get', 'noiseLevel'],
          1, 2, 4, 5,
          8, 9,
          10, 12,
        ],
        'line-color': [
          'interpolate',
          ['linear'],
          ['get', 'noiseLevel'],
          1, 'gray',
          2, 'blue',
          4, 'green',
          6, '#7570b3',
          8, 'orange',
          10, 'red',
        ],
        'line-opacity': 0.6,
      },
    });

    // Railway
    map.addLayer({
      id: 'railway-layer',
      type: 'line',
      source: 'noise-data',
      filter: ['==', ['get', 'sourceType'], 'railway'],
      paint: {
        'line-width': [
          'interpolate',
          ['linear'],
          ['get', 'noiseLevel'],
          2, 2,
          4, 4,
          6, 6,
          8, 8,
          10, 10,
        ],
        'line-color': [
          'interpolate',
          ['linear'],
          ['get', 'noiseLevel'],
          2, 'blue',
          4, 'green',
          6, 'purple',
          8, 'purple',
          10, 'purple',
        ],
        'line-opacity': 0.6,
      },
    });

    // Industry
    map.addLayer({
      id: 'industry-layer',
      type: 'fill',
      source: 'noise-data',
      filter: ['==', ['get', 'sourceType'], 'industry'],
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'noiseLevel'],
          2, 'blue',
          4, 'green',
          6, 'green',
          8, 'orange',
          10, 'red',
        ],
        'fill-opacity': 0.4,
      },
    });

    // School
    map.addLayer({
      id: 'school-layer',
      type: 'fill',
      source: 'noise-data',
      filter: ['==', ['get', 'sourceType'], 'school'],
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'noiseLevel'],
          2, 'blue',
          4, 'green',
          6, 'yellow',
          8, 'orange',
          10, 'purple',
        ],
        'fill-opacity': 0.4,
      },
    });

    updateFilters(map);
  };

  const createRoadFilter = () => {
    return [
      'any',
      roadFilter.motorway && ['==', ['get', 'noiseLevel'], 10],
      roadFilter.trunk && ['==', ['get', 'noiseLevel'], 8],
      roadFilter.primary && ['==', ['get', 'noiseLevel'], 6],
      roadFilter.secondary && ['==', ['get', 'noiseLevel'], 4],
      roadFilter.tertiary && ['==', ['get', 'noiseLevel'], 2],
      roadFilter.default && ['==', ['get', 'noiseLevel'], 1],
    ].filter(Boolean);
  };

  const updateFilters = (map) => {
    const roadFilter = createRoadFilter();

    if (map.getLayer('road-layer')) {
      map.setFilter('road-layer', roadFilter);
    }
    if (map.getLayer('railway-layer')) {
      map.setLayoutProperty('railway-layer', 'visibility', showRailway ? 'visible' : 'none');
    }
    if (map.getLayer('industry-layer')) {
      map.setLayoutProperty('industry-layer', 'visibility', showIndustry ? 'visible' : 'none');
    }
    if (map.getLayer('school-layer')) {
      map.setLayoutProperty('school-layer', 'visibility', showSchools ? 'visible' : 'none');
    }
  };

  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      updateFilters(mapRef.current);
    }
  }, [roadFilter, showRailway, showIndustry, showSchools]);

  useEffect(() => {
    // Om checkboxen för bullerdata är markerad och en kommun är vald, ladda bullerdatan
    if (isNoiseFilterChecked && currentMunicipalityId && markedMunicipalityName === "Eskilstuna kommun") {
      loadNoisePollutionData(mapRef.current, currentMunicipalityId, markedMunicipalityName);
    }
  }, [isNoiseFilterChecked, currentMunicipalityId, markedMunicipalityName]); // Lägg till beroenden så att useEffect körs på ändringar

  const goBackToCountyView = () => {
    setMarkedMunicipalityName(null);
    const map = mapRef.current;
    if (map) {
      setIsMunicipalityView(false);
      setIsCountyView(true);



      map.setLayoutProperty('municipality-boundaries', 'visibility', 'visible');
      map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'visible');

      if (map.getSource('single-municipality')) {
        map.removeLayer('single-municipality-layer');
        map.removeSource('single-municipality');
      }

      if (map.getSource('noise-data')) {
        map.removeLayer('road-layer');
        map.removeLayer('railway-layer');
        map.removeLayer('industry-layer');
        map.removeLayer('school-layer');
        map.removeSource('noise-data');
      }
    }
  };

  const loadSelectedDataType = async (dataType) => {
    const map = mapRef.current;
    if (dataType === "BullerFilter" && isNoiseFilterChecked) {
      // Ladda bullerdata om checkbox är markerad
      await loadNoisePollutionData(map, currentMunicipalityId);
    } else if (dataType === "Fastighetsdata" && isPropertyDataChecked) {
      console.log("Laddar fastighetsdata...");
    }
  };

  const goBackToCountryView = () => {
    setMarkedMunicipalityName(null);
    const map = mapRef.current;
    if (map) {
      setIsCountryView(true);
      setIsCountyView(false);



      map.fitBounds(SWEDEN_BOUNDS, {
        padding: 20
      });
      // map.flyTo({
      //   center: [15.0, 61.0],
      //   zoom: 5,
      // });

      map.setLayoutProperty('county-boundaries', 'visibility', 'visible');
      map.setLayoutProperty('county-boundaries-outline', 'visibility', 'visible');

      if (map.getSource('municipalities')) {
        map.removeLayer('municipality-boundaries');
        map.removeLayer('municipality-boundaries-outline');
        map.removeSource('municipalities');
      }

      if (map.getSource('noise-data')) {
        map.removeLayer('road-layer');
        map.removeLayer('railway-layer');
        map.removeLayer('industry-layer');
        map.removeLayer('school-layer');
        map.removeSource('noise-data');
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidomeny */}
      <aside className="bg-gray-800 text-white w-64 p-6 space-y-4 flex-shrink-0">
        <h2 className="text-xl font-semibold mb-4">Välj Data Typ</h2>
        <div className="flex flex-col space-y-2">
          {/* Checkbox för BullerFilter */}
          <label>
            <input
              type="checkbox"
              checked={isNoiseFilterChecked}
              onChange={(e) => setIsNoiseFilterChecked(e.target.checked)}
            />
            <span className="ml-2">BullerFilter</span>
          </label>

          {/* Checkbox för Fastighetsdata */}
          <label>
            <input
              type="checkbox"
              checked={isPropertyDataChecked}
              onChange={(e) => {
                setIsPropertyDataChecked(e.target.checked);
                if (e.target.checked) loadSelectedDataType("Fastighetsdata");
              }}
            />
            <span className="ml-2">Fastighetsdata</span>
          </label>
        </div>

        {/* Knapp för att växla filtervisning */}
        <button
          onClick={() => setShowFilterOptions((prev) => !prev)}
          className="w-full p-2 mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded"
        >
          {showFilterOptions ? "Dölj Filter" : "Visa Filter"}
        </button>

        {/* Dynamisk visning av filteralternativ baserat på checkboxar */}
        {showFilterOptions && isNoiseFilterChecked && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Bullerfilter</h3>
            <div className="flex flex-col space-y-2">
              {['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'default'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={roadFilter[type]}
                    onChange={() => toggleRoadFilter(type)}
                  />
                  <span className="ml-2 capitalize">{type}</span>
                </label>
              ))}
              <label className="flex items-center">
                <input type="checkbox" checked={showRailway} onChange={() => setShowRailway(!showRailway)} />
                <span className="ml-2">Järnväg</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={showIndustry} onChange={() => setShowIndustry(!showIndustry)} />
                <span className="ml-2">Industri</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={showSchools} onChange={() => setShowSchools(!showSchools)} />
                <span className="ml-2">Skolor</span>
              </label>
            </div>
          </div>
        )}

        {showFilterOptions && isPropertyDataChecked && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Fastighetsdata Filter</h3>
            <p className="text-sm">Inga specifika filter tillgängliga just nu.</p>
          </div>
        )}

        <button
          onClick={goBackToCountryView}
          className="w-full p-2 mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded"
        >
          Återgå till Sverigekartan
        </button>
      </aside>

      {/* Huvudkarta */}
      <div className="flex-grow relative">
        <div className="absolute top-0 right-0 p-4 bg-black bg-opacity-75 text-white">
          <h2 className="text-lg font-bold">{markedMunicipalityName || "Välj en kommun"}</h2>
        </div>
        <div ref={mapContainerRef} className="w-full h-full" />
        {isMunicipalityView && (
          <button
            onClick={goBackToCountyView}
            className="absolute top-20 left-10 p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            Återgå till länsnivå
          </button>
        )}
      </div>
    </div>
  );


};

export default SwedenCountyMap;
