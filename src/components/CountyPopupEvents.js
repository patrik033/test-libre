import mapboxgl from 'mapbox-gl';

/**
 * Adds popup and hover events for county boundaries.
 *
 * @param {Object} map - The Mapbox map instance.
 * @param {Boolean} isCountryView - Whether the country view is active.
 */
export const addCountyPopupEvents = (map, isCountryView) => {
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  // Hover event for counties
  map.on('mousemove', 'county-boundaries', (e) => {
    if (isCountryView) {
      const features = map.queryRenderedFeatures(e.point, { layers: ['county-boundaries'] });
      if (features.length) {
        const feature = features[0];
        map.getCanvas().style.cursor = 'pointer';
        popup.setLngLat(e.lngLat).setHTML(`<strong>${feature.properties.name}</strong>`).addTo(map);
      }
    }
  });

  // Remove popup on mouse leave
  map.on('mouseleave', 'county-boundaries', () => {
    if (isCountryView) {
      map.getCanvas().style.cursor = '';
      popup.remove();
    }
  });
};
