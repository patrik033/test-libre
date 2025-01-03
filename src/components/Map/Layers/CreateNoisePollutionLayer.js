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

    const addPolygonFeature = (nodes, noiseLevel, sourceType) => {
        const coordinates = nodes
            .map((nodeId) => nodesIndex[nodeId])
            .filter(Boolean)
            .map((node) => [node.lon, node.lat]);

        features.push({
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [coordinates] },
            properties: { noiseLevel, sourceType },
        });
    };

    data.elements.forEach((element) => {
        let noiseLevel = 0;
        let sourceType = null;

        // Hantera vägar
        if (element.type === 'way' && element.tags && element.tags.highway) {
            sourceType = 'road';

            // Om det är en primary-väg, behandla den likadant oavsett "ref"-tagg
            switch (element.tags.highway) {
                
                case 'motorway': noiseLevel = 10; break;
                case 'trunk': noiseLevel = 8; break;
                case 'primary': noiseLevel = 6; break;  // Alla primary behandlas likadant
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

        // Hantera industriområden som polygoner med unik ljudnivå
        if (element.tags && element.tags.landuse === 'industrial') {
            sourceType = 'industry';
            noiseLevel = 12;  // Unik ljudnivå för industriområden
            if (element.type === 'way') {
                addPolygonFeature(element.nodes, noiseLevel, sourceType);
            }
        }

        // Hantera skolor som polygoner
        if (element.tags && element.tags.amenity === 'school') {
            sourceType = 'school';
            noiseLevel = 5;
            if (element.type === 'way') {
                addPolygonFeature(element.nodes, noiseLevel, sourceType);
            } else if (element.type === 'node') {
                addFeature(element.lon, element.lat, noiseLevel, sourceType, [30, 60, 90]);
            }
        }
    });

    return { type: 'FeatureCollection', features };
};

export default createNoisePollutionGeoJSON;
