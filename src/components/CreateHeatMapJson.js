const createNoisePollutionGeoJSON = (data) => {
    const features = [];

    // Förindexera noder för att optimera uppslagningar
    const nodesIndex = data.elements
        .filter((el) => el.type === 'node')
        .reduce((index, node) => {
            index[node.id] = { lon: node.lon, lat: node.lat };
            return index;
        }, {});

    const addFeature = (lon, lat, noiseLevel, sourceType, distances) => {
        features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [lon, lat] },
            properties: { noiseLevel, sourceType, distances },
        });
    };

    const addLineFeature = (nodes, noiseLevel, sourceType) => {
        const coordinates = nodes
            .map((nodeId) => nodesIndex[nodeId])
            .filter(Boolean)
            .map((node) => [node.lon, node.lat]);

        features.push({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates },
            properties: { noiseLevel, sourceType },
        });
    };

    data.elements.forEach((element) => {
        let noiseLevel = 0;
        let sourceType = null;

        // Hantera vägar
        if (element.type === 'way' && element.tags && element.tags.highway) {
            sourceType = 'road';
            switch (element.tags.highway) {
                case 'motorway': noiseLevel = 10; break;
                case 'trunk': noiseLevel = 8; break;
                case 'primary': noiseLevel = 6; break;
                case 'secondary': noiseLevel = 4; break;
                case 'tertiary': noiseLevel = 2; break;
                default: noiseLevel = 1;
            }
            addLineFeature(element.nodes, noiseLevel, sourceType);
        }

        // Hantera järnvägar
        if (element.type === 'way' && element.tags && element.tags.railway === 'rail') {
            sourceType = 'railway';
            noiseLevel = 7;
            addLineFeature(element.nodes, noiseLevel, sourceType);
        }

        // Hantera skolor och industriområden som polygoner
        const handlePolygon = (sourceTypeVal, noiseLevelVal, distVal) => {
            if (element.type === 'way') {
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[...element.nodes.map((nodeId) => [nodesIndex[nodeId].lon, nodesIndex[nodeId].lat])]],
                    },
                    properties: { noiseLevel: noiseLevelVal, sourceType: sourceTypeVal },
                });
            } else if (element.type === 'node') {
                addFeature(element.lon, element.lat, noiseLevelVal, sourceTypeVal, distVal);
            }
        };

        if (element.tags && element.tags.amenity === 'school') handlePolygon('school', 5, [30, 60, 90]);
        if (element.tags && element.tags.landuse === 'industrial') handlePolygon('industry', 6, [70, 140, 210]);
    });

    return { type: 'FeatureCollection', features };
};

export default createNoisePollutionGeoJSON;
