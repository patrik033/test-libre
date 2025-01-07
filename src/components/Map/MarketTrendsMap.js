import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'


import Sidebar from '../UI/Sidebar';
import { getFeatureBounds } from './MapUtils';

import { loadCountyBoundaries,addCountyEventListeners } from './Layers/LoadCountryBoundariesLayer';


import { addCountyPopupEvents } from './Layers/AddCountyBoundaryHoverPopup';
import { loadMunicipalities } from './Layers/LoadMunicipalitiesLayer';
import { loadNoisePollutionData } from './Layers/LoadNoisePollutionLayer';
import { updateFilters } from './Layers/CreateNoisePollutionLayerControls';
import FullscreenOverlay from './FullscreenOverlay';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const SWEDEN_BOUNDS = [[10.371094, 55.603178], [24.038086, 69.162558]];
const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

const MarketTrendsMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const countyBoundariesData = useRef(null);
  const municipalityBoundariesData = useRef(null);
  const noiseDataCache = useRef(null);


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

  const [currentMunicipalityRef, setCurrentMunicipalityRef] = useState(null);
  const [realEstateData, setRealEstateData] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null); // State för modaldata

  // Filter för bullerdata
  const [roadFilter, setRoadFilter] = useState({
    motorway: true,
    trunk: true,
    primary: true,
    secondary: true,
    tertiary: true,
    default: true,
  });


  const addPropertyMarkers = (map, properties) => {
    const geojson = {
        type: 'FeatureCollection',
        features: properties.map((property) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [property.longitude, property.latitude],
            },
            properties: {
                id: property.id,
                street: property.street, // Lägg till street i properties
            },
        })),
    };

    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512" fill="#007cbf">
          <rect x="16" y="24" width="32" height="32" fill="#6ba4ff" stroke="#004d99" stroke-width="2"></rect>
          <polygon points="8,24 32,8 56,24" fill="#007cbf" stroke="#004d99" stroke-width="2"></polygon>
          <rect x="24" y="40" width="8" height="16" fill="#004d99"></rect>
          <rect x="36" y="32" width="6" height="6" fill="#ffffff"></rect>
          <rect x="22" y="32" width="6" height="6" fill="#ffffff"></rect>
        </svg>
    `;
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgIcon)}`;

    if (!map.hasImage('property-icon')) {
        const image = new Image(40, 40);
        image.onload = () => {
            map.addImage('property-icon', image);
        };
        image.src = svgDataUrl;
    }

    if (!map.getSource('property-data')) {
        map.addSource('property-data', { type: 'geojson', data: geojson });

        map.addLayer({
            id: 'property-markers',
            type: 'symbol',
            source: 'property-data',
            layout: {
                'icon-image': 'property-icon',
                'icon-size': 1,
                'icon-allow-overlap': true,
            },
        });

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
        });

        // Visa popup med adress vid hover
        map.on('mouseenter', 'property-markers', (e) => {
            const street = e.features[0].properties.street || 'Okänd adress';

            popup
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML(`<div><strong>Adress:</strong> ${street}</div>`)
                .addTo(map);

            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'property-markers', () => {
            popup.remove();
            map.getCanvas().style.cursor = '';
        });

        // Klick för att välja fastighet
        map.on('click', 'property-markers', (e) => {
            const propertyId = e.features[0].properties.id;
            setSelectedProperty(propertyId);
        });
    } else {
        map.getSource('property-data').setData(geojson);
    }
};







  useEffect(() => {
    if (!currentMunicipalityRef) return;


    const fetchRealEstateData = async () => {
      try {

        const response = await fetch(`https://localhost:7150/api/kommuner/realestate/${currentMunicipalityRef}`);
        const data = await response.json();
        setRealEstateData(data);
      } catch (error) {
        console.error('Error fetching real estate data:', error);
      }
    };

    fetchRealEstateData();
  }, [currentMunicipalityRef]);

  // Lägg till fastighetspunkter när fastighetsdata är laddad
  useEffect(() => {
    if (
      mapRef.current &&
      mapRef.current.isStyleLoaded() &&
      isPropertyDataChecked &&
      realEstateData.length > 0
    ) {
      addPropertyMarkers(mapRef.current, realEstateData);
    } else if (
      mapRef.current &&
      mapRef.current.isStyleLoaded() &&
      !isPropertyDataChecked &&
      mapRef.current?.getSource('property-data')
    ) {
      mapRef.current.removeLayer('property-markers');
      mapRef.current.removeSource('property-data');
    }
  }, [realEstateData, isPropertyDataChecked]);


  const toggleRoadFilter = (type) => {
    setRoadFilter((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const onMunicipalityRefUpdate = (currentMunicipality) => {
    setCurrentMunicipalityRef(null)
    setCurrentMunicipalityRef(currentMunicipality)
  }



  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
    });

    mapRef.current = map;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on('load', async () => {
      map.fitBounds(SWEDEN_BOUNDS, {
        padding: 20,
        center: [17.5671981, 62.1983366]
      });

      await loadCountyBoundaries(map, countyBoundariesData);
      //lägger till popup events
      addCountyPopupEvents(map, isCountryView);






      // Klickfunktion för att zooma in på ett län
      map.on('click', 'county-boundaries', async (e) => {
        let countyId = e.features[0].properties.place_id;
        const countyBounds = e.features[0].geometry;  // Hämta geometrin för länet
        setCurrentCountyId(countyId);
        setIsCountryView(false);
        setIsCountyView(true);

        // Använd fitBounds för att centrera länet på kartan
        map.fitBounds(getFeatureBounds(countyBounds), { padding: 20, maxZoom: 8 });

        map.setLayoutProperty('county-boundaries', 'visibility', 'none');
        map.setLayoutProperty('county-boundaries-outline', 'visibility', 'none');


        await loadMunicipalities(
          map,
          countyId,
          municipalityBoundariesData,
          setCurrentMunicipalityId,
          setMarkedMunicipalityName,
          setIsMunicipalityView,
          isNoiseFilterChecked,
          isPropertyDataChecked,
          onMunicipalityRefUpdate
        );
      });
    });

    return () => map.remove();
  }, []);


  useEffect(() => {
    const map = mapRef.current;

    if (isNoiseFilterChecked && markedMunicipalityName === "Eskilstuna kommun") {
      // Ladda bullerdatan om filtret är aktiverat och Eskilstuna kommun är vald
      loadNoisePollutionData(
        map,
        currentMunicipalityId,
        markedMunicipalityName,
        roadFilter,
        showRailway,
        showIndustry,
        showSchools,
        noiseDataCache
      );

    }



    else {
      // Om bullerfiltret är avaktiverat, ta bort bullerdatalagren och källan
      if (map.getSource('noise-data')) {
        if (map.getLayer('road-layer')) map.removeLayer('road-layer');
        if (map.getLayer('railway-layer')) map.removeLayer('railway-layer');
        if (map.getLayer('industry-layer')) map.removeLayer('industry-layer');
        if (map.getLayer('school-layer')) map.removeLayer('school-layer');
        map.removeSource('noise-data');
      }
    }
  }, [isNoiseFilterChecked, currentMunicipalityId, markedMunicipalityName, roadFilter, showRailway, showIndustry, showSchools]);




  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      updateFilters(
        mapRef.current,
        roadFilter,
        showRailway,
        showIndustry,
        showSchools
      );
    }
  }, [roadFilter, showRailway, showIndustry, showSchools]);



  const goBackToCountyView = () => {
    setMarkedMunicipalityName(null);
    const map = mapRef.current;
    if (map) {
      setIsMunicipalityView(false);
      setIsCountyView(true);

      const countyFeature = countyBoundariesData.current.features.find((feature) => feature.properties.place_id === currentCountyId);

      if (countyFeature) {
        const countyBounds = getFeatureBounds(countyFeature.geometry);
        map.fitBounds(countyBounds, { padding: 20, maxZoom: 8 });
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

      if (map.getSource('property-data')) {
        map.removeLayer('property-markers');
        map.removeSource('property-data');
      }
    }
  };

  const loadSelectedDataType = async (dataType) => {
    const map = mapRef.current;
    if (dataType === "BullerFilter" && isNoiseFilterChecked) {
      console.log(dataType)
      // Ladda bullerdata om checkbox är markerad
      await loadNoisePollutionData(map, currentMunicipalityId);
    } else if (dataType === "Fastighetsdata" && isPropertyDataChecked) {
      console.log(dataType)

    }
  };

  const goBackToCountryView = () => {
    setMarkedMunicipalityName(null);
    const map = mapRef.current;
    if (map) {
      setIsCountryView(true);
      setIsCountyView(false);
      setIsMunicipalityView(false);

      // Zooma tillbaka till Sverigekartan
      map.fitBounds(SWEDEN_BOUNDS, {
        padding: 20,
        center: [17.5671981, 62.1983366]
      });

      // Kontrollera och skapa om 'county-boundaries' och 'county-boundaries-outline' om de saknas
      if (!map.getSource('county-boundaries')) {
        // Ladda in din 'county-boundaries' data här
        map.addSource('county-boundaries', {
          type: 'geojson',
          data: countyBoundariesData.current, // Förutsätter att du har lagrat datan i countyBoundariesData
        });

        map.addLayer({
          id: 'county-boundaries',
          type: 'fill',
          source: 'county-boundaries',
          paint: {
            'fill-color': '#FFD700',
            'fill-opacity': 0.4,
          }
        });

        map.addLayer({
          id: 'county-boundaries-outline',
          type: 'line',
          source: 'county-boundaries',
          paint: {
            'line-color': '#333333',
            'line-width': 1,
          }
        });
      } else {
        // Om lagren redan finns, se till att de är synliga
        map.setLayoutProperty('county-boundaries', 'visibility', 'visible');
        map.setLayoutProperty('county-boundaries-outline', 'visibility', 'visible');
      }

      // Ta bort valda kommun- eller buller-lager om de finns
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

      if (map.getSource('property-data')) {
        map.removeLayer('property-markers');
        map.removeSource('property-data');
      }
    }
  };



  function onPlaceSelect(value) {
    console.log({ onPlaceSelect: value });

    if (value && value.properties) {
      const { lon, lat, formatted } = value.properties;

      // Centrera kartan på de valda koordinaterna
      if (mapRef.current) {

        const map = mapRef.current;


        if (map.getSource('county-boundaries')) {
          console.log("FOUND IT!!!")
          //map.removeLayer('county-boundaries');
          //map.removeLayer('county-boundaries-outline');
          // map.removeSource('county-boundaries');

        }


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



        mapRef.current.flyTo({
          center: [lon, lat],
          zoom: 12,
          essential: true,
        });
      }


    }
  }

  function onSuggectionChange(value) {
    //console.log({onSuggestion: value});
  }

  function onUserInput(input) {
    //console.log({onUserInput: input});
  }
  function onOpen(opened) {
    //console.log({onOpen:opened});
  }

  function onClose(closed) {
    //console.log({onOpen: closed})
  }






  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar
        className="w-full md:w-64 bg-gray-800 text-white p-4"
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
        {/* Kommunnamn */}
        <div className="absolute top-0 right-0 p-4 bg-black bg-opacity-75 text-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">
            {markedMunicipalityName || "Välj en kommun"}
          </h2>
        </div>

        {/* Karta */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Fastighetsmodal */}
        {selectedProperty && (
          <FullscreenOverlay
            propertiesToSend={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}

        {/* Återgå-knapp */}
        {isMunicipalityView && (
          <button
            onClick={goBackToCountyView}
            className="absolute top-20 left-10 p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 shadow-md"
          >
            Återgå till länsnivå
          </button>
        )}
      </div>
    </div>
  );


};

export default MarketTrendsMap;
