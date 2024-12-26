import mapboxgl from 'mapbox-gl';
import { getFeatureBounds } from '../../app/Map/MapUtils';
/**
 * Loads municipality boundaries for a given county and adds them to the map.
 *
 * @param {Object} map - The Mapbox map instance.
 * @param {string} countyId - The ID of the selected county.
 * @param {Object} municipalityBoundariesData - A ref to store municipality boundaries data.
 * @param {function} setCurrentMunicipalityId - State setter for the current municipality ID.
 * @param {function} setMarkedMunicipalityName - State setter for the current municipality name.
 * @param {function} setIsMunicipalityView - State setter for municipality view.
 * @param {boolean} isNoiseFilterChecked - Flag for checking if noise data filter is active.
 * @param {boolean} isPropertyDataChecked - Flag for checking if property data filter is active
 * 
 * 
 * 
 * 
 */


const showSelectedMunicipalityBoundary = (map, municipalityFeature,bubbledRefs, onMunicipalityRefUpdate) => {


  const municipalityRef = municipalityFeature.properties.ref;

  


  const municipalityBoundary = {
    type: 'FeatureCollection',
    features: [municipalityFeature],
  };

  if (!map.getSource('selected-municipality')) {
    map.addSource('selected-municipality', { type: 'geojson', data: municipalityBoundary });

    map.addLayer({
      id: 'selected-municipality-boundary',
      type: 'line',
      source: 'selected-municipality',
      paint: {
        'line-color': '#FF0000',
        'line-width': 2,
      },
    });
  } else {
    map.getSource('selected-municipality').setData(municipalityBoundary);
  }

  if (!bubbledRefs.has(municipalityRef)) {
    // Lägg till ref i set
    bubbledRefs.add(municipalityRef);

    // Anropa callback för att bubbla upp ref
    if (onMunicipalityRefUpdate) {
      onMunicipalityRefUpdate(municipalityRef);
    }
  }
};




export const loadMunicipalities = async (
  map,
  countyId,
  municipalityBoundariesData,
  setCurrentMunicipalityId,
  setMarkedMunicipalityName,
  setIsMunicipalityView,
  isNoiseFilterChecked,
  isPropertyDataChecked,
  onMunicipalityRefUpdate 
) => {

  
  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;


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

      const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
      const bubbledRefs = new Set(); // Set för att undvika dubbletter
      // Hover for municipalities
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

      // Click event for municipalities
      map.on('click', 'municipality-boundaries', (e) => {
        const municipalityId = e.features[0].properties.place_id;
        const municipalityName = e.features[0].properties.name;
        const municipalityRef = e.features[0].properties.ref;


        if (onMunicipalityRefUpdate) {
          onMunicipalityRefUpdate(municipalityRef);
        }

        setCurrentMunicipalityId(municipalityId);
        setMarkedMunicipalityName(municipalityName);
        setIsMunicipalityView(true);



       
        if (isNoiseFilterChecked && municipalityName === "Eskilstuna kommun") {
          map.setLayoutProperty('county-boundaries', 'visibility', 'none');
          map.setLayoutProperty('municipality-boundaries', 'visibility', 'none');
          map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'none');
          // loadNoisePollutionData(map, municipalityId, municipalityName); // Om du vill ladda bullerdatan
        } else {
          map.setLayoutProperty('county-boundaries', 'visibility', 'none');
          map.setLayoutProperty('municipality-boundaries', 'visibility', 'none');
          map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'none');
        }

        showSelectedMunicipalityBoundary(map, e.features[0], bubbledRefs, onMunicipalityRefUpdate);

        // Zoom to the selected municipality
        const municipalityBounds = getFeatureBounds(e.features[0].geometry);
        map.fitBounds(municipalityBounds, { padding: 20, maxZoom: 12 });
      });
    }
  } catch (error) {
    console.error('Error loading municipalities data:', error);
  }
};
