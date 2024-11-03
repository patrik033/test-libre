import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicGF0cmlrMDMzIiwiYSI6ImNsemZwYThzajE2Nm4ybHJ5ZWJtN2Z0dTYifQ.x1MLDVCyT30SdSjSj1P6JQ';

const AnimatedMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [16.5, 59.37],
      zoom: 5,
      pitch: 45,
      bearing: -17.5
    });

    mapRef.current = map;

    map.on('load', () => {
      // Säkerställ att kartan har alla sprites
      setTimeout(() => {
        map.flyTo({
          center: [16.5, 59.37],
          zoom: 12,
          bearing: 180,
          curve: 1.8,
          speed: 0.8,
          easing: (t) => t,
        });

        map.once('moveend', () => {
          const currentCenter = map.getCenter();
          const currentZoom = map.getZoom();
          const currentBearing = map.getBearing();
          const currentPitch = map.getPitch();
          map.gets

          // Byt stil och justera vy utan spritevarning
          map.once('style.load', () => {
            map.jumpTo({
              center: currentCenter,
              zoom: currentZoom,
              bearing: currentBearing,
              pitch: currentPitch,
            });
          });

          // Fördröjning innan stilbyte för att undvika spritevarning
          setTimeout(() => {
            map.setStyle('mapbox://styles/mapbox/streets-v12');
          }, 100);
        });
      }, 500);
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default AnimatedMap;
