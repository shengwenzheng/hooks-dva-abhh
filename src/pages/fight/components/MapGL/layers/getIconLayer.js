// eslint-disable-next-line import/no-extraneous-dependencies
import { IconLayer } from '@deck.gl/layers';
import { ICON_SIZE } from '../config/config';
import { wgs84togcj02 } from '@/pages/routeGuard/components/Map/gpsconvert/gpsConvert.js';
export default (dataArg, events = {}, id = 'icon-layer', visibility = true, bConvert = true) => {
  if (!Array.isArray(dataArg) || dataArg.length === 0 || !visibility) {
    return [];
  }
  const data = JSON.parse(JSON.stringify(dataArg));
  if (bConvert) { // 转换成火星坐标
    for (let i = 0; i < data.length; i++) {
      const xy = data[i].coordinates;
      data[i].coordinates = wgs84togcj02(...xy).reverse();
    }
  }
  return [
    new IconLayer({
      id,
      data: data.filter(
        d =>
          d.image &&
          d.coordinates.length === 2 &&
          d.coordinates[0] !== 0 &&
          !isNaN(d.coordinates[0]),
      ),
      pickable: true,
      // iconAtlas and iconMapping are required
      // getIcon: return a string
      getIcon: d => ({
        // If for the same icon identifier, getIcon returns different width or height,
        // IconLayer will only apply the first occurrence and ignore the rest of them.
        id: `${d.image}-${d.width || ICON_SIZE}-${d.height || ICON_SIZE}`,
        url: d.image,
        width: d.width || d.height || ICON_SIZE,
        height: d.height || d.width || ICON_SIZE,
        anchorX: d.anchorX, // Default: half width.
        anchorY: d.anchorY, // Default: half height.
      }),
      getAngle: d => d.angle || 0,
      billboard: false,
      getPosition: d => d.coordinates,
      getSize: d => d.height || d.width || ICON_SIZE,
      ...events,
    }),
  ];
};
