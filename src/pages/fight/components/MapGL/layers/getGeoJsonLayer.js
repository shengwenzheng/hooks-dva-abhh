import { GeoJsonLayer } from '@deck.gl/layers';
import { rgb } from 'd3-color';
import { wgs84togcj02 } from '@/pages/routeGuard/components/Map/gpsconvert/gpsConvert.js';

function colorToRGBArray(color) {
  if (Array.isArray(color)) {
    return color.slice(0, 4);
  }
  const c = rgb(color);
  return [c.r, c.g, c.b, 255];
}

function createLayer(data) {
  if (!data || !data.geometry) {
    return [];
  }

  const { coordinates } = data.geometry;
  // 一条路线
  for (let i = 0; i < coordinates[0].length; i++) {
    let xy = coordinates[0][i];
    // coordinates[0][i] = wgs84togcj02(...xy).reverse();
  }
  data.geometry.coordinates = coordinates;

  return new GeoJsonLayer({
    id: 'geojson-layer' + coordinates[0].length,
    data,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 1,
    getFillColor: colorToRGBArray('blue'),
    getLineColor: colorToRGBArray('blue'),
    getRadius: 1,
    getLineWidth: 1,
    getElevation: 0,
    opacity: 0.008,
    fillOpacity: 0,
    onHover: ({ object, x, y }) => {
      // const tooltip = object.properties.name || object.properties.station;
      /* Update tooltip
         http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
      */
    },
  });
}
export default data => {
  if (Array.isArray(data)) {
    return data.map(item => createLayer(item));
  } else if (data) {
    return [createLayer(data)];
  } else {
    return [];
  }
};
