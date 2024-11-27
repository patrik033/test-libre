import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import Footer from '@/components/UI/Footer/Footer';

import Sidebar from '../../components/UI/Sidebar';
import { getFeatureBounds } from './MapUtils';
import { loadCountyBoundaries, addCountyEventListeners } from '../../components/Layers/LoadCountryBoundariesLayer';
import { addCountyPopupEvents } from '@/components/Layers/AddCountyBoundaryHoverPopup';
import { loadMunicipalities } from '@/components/Layers/LoadMunicipalitiesLayer';
import { loadNoisePollutionData } from '@/components/Layers/LoadNoisePollutionLayer';
import { updateFilters } from '@/components/Layers/CreateNoisePollutionLayerControls';

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
          isNoiseFilterChecked
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
    } else {
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
    }
  };
  


  function onPlaceSelect(value) {
    console.log({ onPlaceSelect: value });

    if (value && value.properties) {
      const { lon, lat, formatted } = value.properties;

      // Centrera kartan på de valda koordinaterna
      if (mapRef.current) {

        const map = mapRef.current;


        if(map.getSource('county-boundaries')){
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

      // Ta bort tidigare markör om den finns
      // if (markerRef.current) {
      //   markerRef.current.remove();
      // }

      // Lägg till en ny markör på kartan
      // markerRef.current = new mapboxgl.Marker()
      //   .setLngLat([lon, lat])
      //   .setPopup(new mapboxgl.Popup().setText(formatted)) // Popup med adressinformation
      //   .addTo(mapRef.current);
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
      {/* <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow-md w-80">
        <GeoapifyContext apiKey="217e62842c104e729482561d013f7494">
          <div className="absolute top-4 left-4 z-10 w-80">
             <GeoapifyGeocoderAutocomplete
             placeholder='Skriv in adress här'
              placeSelect={onPlaceSelect}
              suggestionsChange={onSuggectionChange}
              onUserInput={onUserInput}
              onOpen={onOpen}
              onClose={onClose}
              allowNonVerifiedHouseNumber={true}
            />
          </div>
        </GeoapifyContext>

      </div> */}


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

export default MarketTrendsMap;
