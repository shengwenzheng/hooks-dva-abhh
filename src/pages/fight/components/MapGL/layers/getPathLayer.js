// eslint-disable-next-line import/no-extraneous-dependencies
import { PathLayer } from '@deck.gl/layers';
import { wgs84togcj02 } from '@/pages/routeGuard/components/Map/gpsconvert/gpsConvert.js';

function transform(data) {
  if (data && data.data) {
    for (let i = 0; i < data.data.length; i++) {
      const path = data.data[i].path;
      for (let ii = 0; ii < path.length; ii++) {
        path[ii] = wgs84togcj02(...path[ii]).reverse();
      }
      data.data[i].path = path;
    }
  }
}
export default data => {
  const rst = [];
  if (Array.isArray(data)) {
    data.map((item = {}) => {
      // transform(item);
      rst.push(new PathLayer(item));
    });
  } else if (data) {
    // transform(data);
    rst.push(new PathLayer(data));
  }
  return rst;
};
