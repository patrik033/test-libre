import createNoisePollutionGeoJSON from "./CreateNoisePollutionLayer";
import { updateFilters } from './CreateNoisePollutionLayerControls';

export const loadNoisePollutionData = async (map, municipalityId, municipalityName, roadFilter, showRailway, showIndustry, showSchools,noiseDataCache) => {
    try {
        if (!noiseDataCache.current) {
            console.log(`Laddar bullerdata för: ${municipalityName} från servern`);
            const response = await fetch('/export.geojson'); // Eskilstunas bullerdata
            const rawData = await response.json();
            noiseDataCache.current = createNoisePollutionGeoJSON(rawData); // Cachar datan
        }
        else{
            console.log(`Använder cachad bullerdata för: ${municipalityName}`);
        }

        const noiseGeoJSON = noiseDataCache.current;

        if (map.getSource('noise-data')) {
            map.getSource('noise-data').setData(noiseGeoJSON);
        } else {
            map.addSource('noise-data', { type: 'geojson', data: noiseGeoJSON });
            addNoiseLayers(map, roadFilter, showRailway, showIndustry, showSchools);
        }

    updateFilters(map, roadFilter, showRailway, showIndustry, showSchools);


        map.setLayoutProperty('municipality-boundaries', 'visibility', 'none');
        map.setLayoutProperty('municipality-boundaries-outline', 'visibility', 'none');
    } catch (error) {
        console.error('Error loading noise data:', error);
    }
};

export const addNoiseLayers = (map) => {
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
                6, 7,
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
                6, '#ffa500',
                8, 'orange',
                10, 'red',
                12, '#d9534f',
            ],
            'fill-opacity': 0.4,
        },
    });

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

    // Uppdaterar filter baserat på de senaste inställningarna
};
