export const getFeatureBounds = (geometry) => {

  let coordinates = [];

  if (geometry.type === 'Polygon') {
    coordinates = geometry.coordinates[0];
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((polygon) => {
      coordinates = coordinates.concat(polygon[0]);
    });
  } else {
    console.warn("Unknown geometry type:", geometry.type);
    return null;
  }

  const lats = coordinates.map(coord => coord[1]);
  const lngs = coordinates.map(coord => coord[0]);

  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
};