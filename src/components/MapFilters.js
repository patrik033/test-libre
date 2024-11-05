// MapFilters.js
const createRoadFilter = (roadFilter) => {
    const roadFilterLayer = [
        'any',
        roadFilter.motorway && ['==', ['get', 'noiseLevel'], 10],
        roadFilter.trunk && ['==', ['get', 'noiseLevel'], 8],
        roadFilter.primary && ['==', ['get', 'noiseLevel'], 6],
        roadFilter.secondary && ['==', ['get', 'noiseLevel'], 4],
        roadFilter.tertiary && ['==', ['get', 'noiseLevel'], 2],
        roadFilter.default && ['==', ['get', 'noiseLevel'], 1],
    ].filter(Boolean);

    //console.log("createRoadFilter output:", roadFilterLayer); // Lägg till denna logg för att se vad roadFilter genererar
    return roadFilterLayer;
};
  
  export const updateFilters = (map, roadFilter, showRailway, showIndustry, showSchools) => {
    const roadFilterLayer = createRoadFilter(roadFilter);

    // Kontrollera och logga lagerstatus
    console.log("Uppdaterar filter. Kontrollerar lager:");

    if (map.getLayer('road-layer')) {
        //console.log("road-layer finns");
        map.setFilter('road-layer', roadFilterLayer);
    } else {
        //console.log("road-layer saknas");
    }

    if (map.getLayer('railway-layer')) {
        //console.log("railway-layer finns");
        map.setLayoutProperty('railway-layer', 'visibility', showRailway ? 'visible' : 'none');
    } else {
        //console.log("railway-layer saknas");
    }

    if (map.getLayer('industry-layer')) {
        //console.log("industry-layer finns");
        map.setLayoutProperty('industry-layer', 'visibility', showIndustry ? 'visible' : 'none');
    } else {
        //console.log("industry-layer saknas");
    }

    if (map.getLayer('school-layer')) {
        //console.log("school-layer finns");
        map.setLayoutProperty('school-layer', 'visibility', showSchools ? 'visible' : 'none');
    } else {
        //console.log("school-layer saknas");
    }
};

  