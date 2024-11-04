import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import createNoisePollutionGeoJSON from '../../components/CreateHeatMapJson';
import Sidebar from '../../components/Sidebar';
import { getFeatureBounds } from '../../components/MapUtils';
import { loadCountyBoundaries ,addCountyEventListeners } from '../../components/Boundaries';



mapboxgl.accessToken = 'pk.eyJ1IjoicGF0cmlrMDMzIiwiYSI6ImNsemZwYThzajE2Nm4ybHJ5ZWJtN2Z0dTYifQ.x1MLDVCyT30SdSjSj1P6JQ';
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
const SWEDEN_BOUNDS = [[10.371094, 55.603178], [24.038086, 69.162558]];

const MapBoundaries = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const countyBoundariesData = useRef(null);
  const municipalityBoundariesData = useRef(null);

  const [isCountryView, setIsCountryView] = useState(true);
  const [isCountyView, setIsCountyView] = useState(false);
  const [isMunicipalityView, setIsMunicipalityView] = useState(false);
  const [currentCountyId, setCurrentCountyId] = useState(null);
  const [currentMunicipalityId, setCurrentMunicipalityId] = useState(null);
  const [markedMunicipalityName, setMarkedMunicipalityName] = useState(null);

  const [selectedDataType, setSelectedDataType] = useState(""); 
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const [isNoiseFilterChecked, setIsNoiseFilterChecked] = useState(false);
  const [isPropertyDataChecked, setIsPropertyDataChecked] = useState(false);
  const [showRailway, setShowRailway] = useState(true);
  const [showIndustry, setShowIndustry] = useState(true);
  const [showSchools, setShowSchools] = useState(true);


  // Filter för bullerdata
  const [roadFilter, setRoadFilter] = useState({
    motorway: true,
    trunk: true,
    primary: true,
    secondary: true,
    tertiary: true,
    default: true,
  });




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
      await loadCountyBoundaries(map,countyBoundariesData);




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
  
        // Skapa popup för kommuner
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });
  
        // Hover för kommuner
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
  
        // Klicka på en kommun
        map.on('click', 'municipality-boundaries', async (e) => {
          const municipalityId = e.features[0].properties.place_id;
          const municipalityName = e.features[0].properties.name;
  
          setCurrentMunicipalityId(municipalityId);
          setMarkedMunicipalityName(municipalityName);
          setIsMunicipalityView(true);
          
          if (isNoiseFilterChecked && municipalityName === "Eskilstuna kommun") {
            map.setLayoutProperty('county-boundaries', 'visibility', 'none');
            map.setLayoutProperty('municipality-boundaries', 'visibility', 'none');
            map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'none');
            //loadNoisePollutionData(map, municipalityId, municipalityName);
          } else {
            map.setLayoutProperty('county-boundaries', 'visibility', 'none');
            map.setLayoutProperty('municipality-boundaries', 'visibility', 'none');
            map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'none');
          }
  
          showSelectedMunicipalityBoundary(map, e.features[0]);
  
          // Zooma in på vald kommun
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
  
  

  const showSelectedMunicipalityBoundary = (map, municipalityFeature) => {
    const municipalityBoundary = {
      type: "FeatureCollection",
      features: [municipalityFeature],
    };
  
    // Lägg till eller uppdatera source för den valda kommunen
    if (!map.getSource("selected-municipality")) {
      map.addSource("selected-municipality", {
        type: "geojson",
        data: municipalityBoundary,
      });
  
      // Lägg till lager för kommungränsen
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
    // Roads - uppdaterad färginställning och filter för att undvika konflikt med industriområden
    map.addLayer({
        id: 'road-layer',
        type: 'line',
        source: 'noise-data',
        filter: ['==', ['get', 'sourceType'], 'road'], // Säkerställer att endast "road" visas
        paint: {
            'line-width': [
                'interpolate',
                ['linear'],
                ['get', 'noiseLevel'],
                1, 2,
                4, 5,
                6, 7,  // Differentiera från industriområden
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
                6, 'green',
                8, 'orange',
                10, 'red',
            ],
            'line-opacity': 0.6,
        },
    });

    // Railway - samma logik men annan färgskala
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

    // Industry - säkerställ att endast industriområden har en unik färg och `noiseLevel`
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
                6, '#ffa500', // Använd en distinkt färg för industriområden (t.ex. orange)
                8, 'orange',
                10, 'red',
                12, '#d9534f', // Unik färg för högre industri-ljudnivå
            ],
            'fill-opacity': 0.4,
        },
    });

    // School - säkerställ unik färg för skolområden
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

      const countyFeature = countyBoundariesData.current.features.find((feature) => feature.properties.place_id === currentCountyId);
      
      if(countyFeature){
        const countyBounds = getFeatureBounds(countyFeature.geometry);
        map.fitBounds(countyBounds,{padding: 20,maxZoom: 8});
      }



      map.setLayoutProperty('municipality-boundaries', 'visibility', 'visible');
      map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'visible');

      if (map.getSource('selected-municipality')) {
        map.removeLayer('selected-municipality-boundary');
        map.removeSource('selected-municipality');
      }

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

      if (map.getSource('selected-municipality')) {
        map.removeLayer('selected-municipality-boundary');
        map.removeSource('selected-municipality');
      }

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
    <Sidebar
      isNoiseFilterChecked={isNoiseFilterChecked}
      setIsNoiseFilterChecked={setIsNoiseFilterChecked}
      isPropertyDataChecked={isPropertyDataChecked}
      setIsPropertyDataChecked={setIsPropertyDataChecked}
      loadSelectedDataType={loadSelectedDataType}
      showFilterOptions={showFilterOptions}
      setShowFilterOptions={setShowFilterOptions}
      roadFilter={roadFilter}
      toggleRoadFilter={toggleRoadFilter}
      showRailway={showRailway}
      setShowRailway={setShowRailway}
      showIndustry={showIndustry}
      setShowIndustry={setShowIndustry}
      showSchools={showSchools}
      setShowSchools={setShowSchools}
      goBackToCountryView={goBackToCountryView}
    />
    
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

export default MapBoundaries;
