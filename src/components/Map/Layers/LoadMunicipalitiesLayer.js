// ./Layers/LoadMunicipalitiesLayer.js
import mapboxgl from 'mapbox-gl';
import { getFeatureBounds } from '../MapUtils';

const showSelectedMunicipalityBoundary = (
  map,
  municipalityFeature,
  bubbledRefs,
  onMunicipalityRefUpdate
) => {
  const municipalityRef = municipalityFeature.properties.ref;
  const municipalityBoundary = {
    type: 'FeatureCollection',
    features: [municipalityFeature],
  };

  if (!map.getSource('selected-municipality')) {
    map.addSource('selected-municipality', {
      type: 'geojson',
      data: municipalityBoundary,
    });

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
    bubbledRefs.add(municipalityRef);
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
  try {
    // ===> Viktig skillnad: anropa din egen API-route i stället <===
    const response = await fetch('/api/municipalities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countyId }),
    });
    const data = await response.json();

    // Spara data i en ref (t.ex. municipalityBoundariesData.current)
    municipalityBoundariesData.current = data;

    // Dölj länslagren
    map.setLayoutProperty('county-boundaries', 'visibility', 'none');
    map.setLayoutProperty('county-boundaries-outline', 'visibility', 'none');

    // Om 'municipalities'-källan redan finns, uppdatera dess data
    if (map.getSource('municipalities')) {
      map.getSource('municipalities').setData(data);
    } else {
      // Annars skapa källan och lagren
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

      // Popup vid hover
      const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
      const bubbledRefs = new Set();

      map.on('mousemove', 'municipality-boundaries', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['municipality-boundaries'],
        });
        if (features.length) {
          const feature = features[0];
          map.getCanvas().style.cursor = 'pointer';
          popup
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${feature.properties.name}</strong>`)
            .addTo(map);
        }
      });

      map.on('mouseleave', 'municipality-boundaries', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      // Klick på kommun
      map.on('click', 'municipality-boundaries', (e) => {
        const municipalityId = e.features[0].properties.place_id;
        const municipalityName = e.features[0].properties.name;
        const municipalityRef = e.features[0].properties.ref;

        // Kalla på callback för ref-uppdatering
        if (onMunicipalityRefUpdate) {
          onMunicipalityRefUpdate(municipalityRef);
        }

        // Sätt states för vald kommun
        setCurrentMunicipalityId(municipalityId);
        setMarkedMunicipalityName(municipalityName);
        setIsMunicipalityView(true);

        // Exempel: om bullerfilter är på och Eskilstuna
        if (isNoiseFilterChecked && municipalityName === 'Eskilstuna kommun') {
          map.setLayoutProperty('county-boundaries', 'visibility', 'none');
          map.setLayoutProperty('municipality-boundaries', 'visibility', 'none');
          map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'none');
          // loadNoisePollutionData(map, municipalityId, municipalityName); // Exempel
        } else {
          map.setLayoutProperty('county-boundaries', 'visibility', 'none');
          map.setLayoutProperty('municipality-boundaries', 'visibility', 'none');
          map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'none');
        }

        // Ritar en röd linje runt vald kommun
        showSelectedMunicipalityBoundary(map, e.features[0], bubbledRefs, onMunicipalityRefUpdate);

        // Zoomar in på kommunen
        const municipalityBounds = getFeatureBounds(e.features[0].geometry);
        map.fitBounds(municipalityBounds, { padding: 20, maxZoom: 12 });
      });
    }
  } catch (error) {
    console.error('Error loading municipalities data:', error);
  }
};
