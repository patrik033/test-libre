import createNoisePollutionGeoJSON from './CreateHeatMapJson.js';

self.onmessage = function (e) {
    const data = e.data;
    const noiseGeoJSON = createNoisePollutionGeoJSON(data); // Anropa funktionen direkt
    postMessage(noiseGeoJSON);
};
