import * as turf from '@turf/helpers';
import TurfBuffer  from '@turf/buffer';

const bufferAnalyze = (feature, radius) => {
  //var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
  const polyline = turf.lineString(feature);
  const buffer = TurfBuffer (polyline, radius, {units: 'meters'});
  return buffer;
}

export { bufferAnalyze };
