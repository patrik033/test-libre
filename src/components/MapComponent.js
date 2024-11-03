import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import createNoisePollutionGeoJSON from './CreateHeatMapJson';

mapboxgl.accessToken = 'pk.eyJ1IjoicGF0cmlrMDMzIiwiYSI6ImNsemZwYThzajE2Nm4ybHJ5ZWJtN2Z0dTYifQ.x1MLDVCyT30SdSjSj1P6JQ';
//mapboxgl.workerCount = 4;

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [roadFilter, setRoadFilter] = useState({
    motorway: true,
    trunk: true,
    primary: true,
    secondary: true,
    tertiary: true,
    default: true,
  });

  const [showRailway, setShowRailway] = useState(true);
  const [showIndustry, setShowIndustry] = useState(true);
  const [showSchools, setShowSchools] = useState(true);

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
      center: [16.5, 59.37],
      zoom: 12,
      maxZoom: 20,
    });
    mapRef.current = map;

    map.on('load', () => {
      fetch('/export.geojson')
        .then((response) => response.json())
        .then((data) => {
          const noiseGeoJSON = createNoisePollutionGeoJSON(data);

          map.addSource('noise-data', {
            type: 'geojson',
            data: noiseGeoJSON,
          });

          // Road layer
          map.addLayer({
            id: 'road-layer',
            type: 'line',
            source: 'noise-data',
            filter: createRoadFilter(),
            paint: {
              'line-width': [
                'interpolate',
                ['linear'],
                ['get', 'noiseLevel'],
                1, 2,
                4, 5,
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
                6, '#7570b3',
                8, 'orange',
                10, 'red',
              ],
              'line-opacity': 0.6,
            },
          });

          // Railway layer
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

          // Industry layer
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
                2, 'blue',
                4, 'green',
                6, 'green',
                8, 'orange',
                10, 'red',
              ],
              'fill-opacity': 0.4,
            },
          });

          // School layer
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
        })
        .catch((error) => console.error('Error loading JSON data:', error));
    });

    return () => map.remove();
  }, []);

  const createRoadFilter = () => {
    return ['any',
      roadFilter.motorway && ['==', ['get', 'noiseLevel'], 10],
      roadFilter.trunk && ['==', ['get', 'noiseLevel'], 8],
      roadFilter.primary && ['==', ['get', 'noiseLevel'], 6],
      roadFilter.secondary && ['==', ['get', 'noiseLevel'], 4],
      roadFilter.tertiary && ['==', ['get', 'noiseLevel'], 2],
      roadFilter.default && ['==', ['get', 'noiseLevel'], 1] 
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: '100%',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        borderBottom: '1px solid #ddd',
      }}>
        <h4 style={{ marginRight: '20px' }}>Filter</h4>
        <div style={{ marginRight: '20px' }}>
          <h5>Road Types</h5>
          {['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'default'].map((type) => (
            <label key={type} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={roadFilter[type]}
                onChange={() => toggleRoadFilter(type)}
              />
              <span style={{
                backgroundColor: type === 'motorway' ? 'red' :
                                 type === 'trunk' ? 'orange' :
                                 type === 'primary' ? '#7570b3' :
                                 type === 'secondary' ? 'green' :
                                 type === 'tertiary' ? 'blue' : 'gray',
                padding: '2px 8px',
                borderRadius: '4px',
                color: 'white',
                marginLeft: '5px'
              }}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </label>
          ))}
        </div>
        <div style={{ marginRight: '20px' }}>
          <h5>Source Types</h5>
          <label style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={showRailway}
              onChange={() => setShowRailway(!showRailway)}
            />
            <span style={{ backgroundColor: 'purple', padding: '2px 8px', borderRadius: '4px', color: 'white', marginLeft: '5px' }}>Railway</span>
          </label>
          <label style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={showIndustry}
              onChange={() => setShowIndustry(!showIndustry)}
            />
            <span style={{ backgroundColor: 'green', padding: '2px 8px', borderRadius: '4px', color: 'white', marginLeft: '5px' }}>Industry</span>
          </label>
          <label style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={showSchools}
              onChange={() => setShowSchools(!showSchools)}
            />
            <span style={{ backgroundColor: 'blue', padding: '2px 8px', borderRadius: '4px', color: 'white', marginLeft: '5px' }}>School</span>
          </label>
        </div>
      </div>
      <div ref={mapContainerRef} style={{ width: '80%', height: '90vh', position: 'relative' }} />
    </div>
  );
};

export default MapComponent;
