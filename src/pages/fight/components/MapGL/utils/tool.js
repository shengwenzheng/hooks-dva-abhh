import { rgb } from 'd3-color';
import pointsWithinPolygon from '@turf/points-within-polygon';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import booleanCrosses from '@turf/boolean-crosses';
import length from '@turf/length';
import * as turf from '@turf/helpers';
import AreaJson from '@/pages/fight/components/MapGL/data/hangzhou.json';

function colorToRGBArray(color) {
  if (Array.isArray(color)) {
    return color.slice(0, 4);
  }
  const c = rgb(color);
  return [c.r, c.g, c.b, 255];
}

function getRouteSteps(carRoute) {
  const routeLatlngs = [];
  if (carRoute && carRoute.result && carRoute.result.routes) {
    const { routes } = carRoute.result;
    const { steps = [] } = (!Array.isArray(routes) ? routes : routes[0]) || {};
    if (Array.isArray(steps)) {
      steps.forEach(item => {
        const { path } = item;
        path.split(';').forEach(xystr => {
          const xy = xystr.split(',');
          xy.length === 2 && routeLatlngs.push(xy);
        });
      });
    }
  }
  return routeLatlngs;
}

/**
 * 前端框选
 * @param coordinateList 多边形坐标，数组第一个元素与最后一个用同一个点
 */
const polygonSelectInFront = (coordinateList, videoMarkers) => {
  const poly = turf.polygon([coordinateList]);
  const rst = [];
  videoMarkers.forEach(obj => {
    // item.forEach(obj => {
    let point = turf.point(obj.coordinates);
    const tmp = pointsWithinPolygon(point, poly);
    if (tmp.features.length > 0) {
      rst.push(obj);
    }
    // });
  });
  return rst;
};

/**
 * 计算角度
 */
const getAngle = (startPt, endPt) => {
  if (startPt.length !== 2 || endPt.length !== 2) {
    return 0;
  }
  const y = endPt[1] - startPt[1];
  let x = endPt[0] - startPt[0];
  if (x === 0) {
    x = 0.00000000001;
  }
  let angle = (Math.atan(y / x) * 180) / Math.PI;
  if (x < 0) {
    angle += 180;
  }
  return angle;
};
/**
 * 求点位经过的辖区
 * @param data 点位
 * @returns {*} 辖区，包括名称、编码
 */
const getRegionNameByPoint = data => {
  const rst = [];
  if (data && !Array.isArray(data)) {
    data = [data];
  }
  if (Array.isArray(data)) {
    data.forEach(item => {
      const { name, code } = pointInPolygon(item);
      rst.push({ name, code });
    });
  }
  console.log('getRegionNameByPoint', rst.length === 1 ? rst[0] : rst);
  return rst.length === 1 ? rst[0] : rst;
};
/**
 * 求路线组经过的所有辖区
 * @param path 路线
 * @returns {[]} 辖区数组
 */
const getCrossRegionByPath = path => {
  const rst = [];
  if (Array.isArray(path) && path.length > 1) {
    const pathLine = turf.lineString(path);
    AreaJson.forEach(item => {
      const {coordinates, type, properties} = item;
      if (type.toLowerCase() === 'polygon') {
        const __poly = turf.polygon(coordinates);
        const bCroess = booleanCrosses(pathLine, __poly);
        if (bCroess) {
          rst.push(item);
        }
      }
    });
  }
  return rst;
};

const pointInPolygon = point => {
  let name = '';
  let code = '';
  let _coordinates = [];
  const __point = turf.point(point);
  AreaJson.every(item => {
    const { coordinates, type, properties } = item;
    if (type.toLowerCase() === 'polygon') {
      const __poly = turf.polygon(coordinates);
      const tmp = pointsWithinPolygon(__point, __poly);
      if (tmp.features.length > 0) {
        name = properties.name;
        code = properties.code;
        _coordinates = coordinates;
        return false;
      }
    }
    return true;
  });
  return { name, code, coordinates: _coordinates };
};

const getUrlParams = name => {
  // 不传name返回所有值，否则返回对应值
  var url = window.location.search;
  if (url.indexOf('?') == 1) {
    return false;
  }
  url = url.substr(1);
  url = url.split('&');
  var name = name || '';
  var nameres;
  // 获取全部参数及其值
  for (var i = 0; i < url.length; i++) {
    var info = url[i].split('=');
    var obj = {};
    obj[info[0]] = decodeURI(info[1]);
    url[i] = obj;
  }
  // 如果传入一个参数名称，就匹配其值
  if (name) {
    for (var i = 0; i < url.length; i++) {
      for (const key in url[i]) {
        if (key == name) {
          nameres = url[i][key];
        }
      }
    }
  } else {
    nameres = url;
  }
  // 返回结果
  return nameres;
};

/**
 * 计算当前地图一个像素对应实际距离多少米
 * @param map
 * @returns {{x: *, y: *}}
 */
function getMeterFromPiexel(map) {
  try {
    var centerLatLng = map.getCenter(); // get map center
    var pointC = map.latLngToContainerPoint(centerLatLng); // convert to containerpoint (pixels)
    var pointX = [pointC.x + 1, pointC.y]; // add one pixel to x
    var pointY = [pointC.x, pointC.y + 1]; // add one pixel to y

    // convert containerpoints to latlng's
    var latLngC = map.containerPointToLatLng(pointC);
    var latLngX = map.containerPointToLatLng(pointX);
    var latLngY = map.containerPointToLatLng(pointY);

    var distanceX = latLngC.distanceTo(latLngX); // calculate distance between c and x (latitude)
    var distanceY = latLngC.distanceTo(latLngY); // calculate distance between c and y (longitude)
    return { x: distanceX, y: distanceY };
  } catch (e) {
    return { x: 20, y: 20 };
  }
}

function isSameRoutes(newRoutes, oldRoutes) {}

function distanceToStart(point, path) {
  var line = turf.lineString(path);
  var pt = turf.point(point);

  var snapped = nearestPointOnLine(line, pt, { units: 'degrees' });
  const { properties, geometry } = snapped;
  const { index } = properties;
  const { coordinates } = geometry;

  const rst = path.slice(0, index);
  rst.push(coordinates);
  var tmpline = turf.lineString(rst);
  // console.log(length(tmpline, { units: 'degrees' }), 'degrees');
  const len = length(tmpline, { units: 'degrees' });
  return (len * 6378137 * Math.PI * 2) / 360;
}

function getLengthFromRoutesAB(pointA, pointB, path) {
  if (!Array.isArray(path) || path.length < 2
      || !Array.isArray(pointA) || pointA.length !== 2
      || !Array.isArray(pointB) || pointB.length !== 2) {
    return 0;
  }
  var line = turf.lineString(path);
  // console.log('line', length(line, { units: 'degrees' }));
  var pta = turf.point(pointA);
  var ptb= turf.point(pointB);
  var snappedA = nearestPointOnLine(line, pta, { units: 'degrees' });
  var snappedB = nearestPointOnLine(line, ptb, { units: 'degrees' });

  var indexA = snappedA.properties.index;
  var indexB = snappedB.properties.index;
  var coordinatesA = snappedA.geometry.coordinates;
  var coordinatesB = snappedB.geometry.coordinates;
  var tmp = 0, coordTmp = [];
  if (indexA > indexB) {
    tmp = indexA;
    indexA = indexB;
    indexB = tmp;
    coordTmp = coordinatesA;
    coordinatesA = coordinatesB;
    coordinatesB = coordTmp;
  }
  const rst =  path.slice(indexA + 1, indexB);
  const coordinatesArr = [coordinatesA, ...rst, coordinatesB];
  var tmpline = turf.lineString(coordinatesArr);
  // console.log(length(tmpline, { units: 'degrees' }), 'degrees');
  const len = length(tmpline, { units: 'degrees' });
  return (len * 6378137 * Math.PI * 2) / 360;
}

/**
 * 计算途径点沿道路的距离
 * @param pointA 途径点A
 * @param pointB 途径点B
 * @param securityDetail 线路
 * @returns {number|*} 单位：米
 */
function getLengthFromRoutesABEx(pointA, pointB, securityDetail) {
  if (!Array.isArray(pointA) || !Array.isArray(pointB) || !securityDetail || !securityDetail.routes) {
    return 0;
  }
  let route = securityDetail.routes;
  if (Array.isArray(route)) {
    route = route[0];
  }
  const routePath = getRouteSteps({ result: route.routeJson });
  return getLengthFromRoutesAB(pointA, pointB, routePath)
}

function pointInPath(point, path) {
  if (!Array.isArray(path) || path.length < 2 || !Array.isArray(point) || point.length !== 2) {
    return 0;
  }
  var line = turf.lineString(path);
  var pt = turf.point(point);
  var snappedA = nearestPointOnLine(line, pt, { units: 'degrees' });
  return snappedA;
}

export {
  getLengthFromRoutesABEx,
  colorToRGBArray,
  getRouteSteps,
  polygonSelectInFront,
  getAngle,
  getRegionNameByPoint,
  getCrossRegionByPath,
  getUrlParams,
  getMeterFromPiexel,
  distanceToStart,
  getLengthFromRoutesAB,
  pointInPath,
};
