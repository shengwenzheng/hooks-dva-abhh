import React, { Component, createRef, Fragment } from 'react';
import { Map, TileLayer, Marker, Polyline, Circle, GeoJSON, Tooltip } from 'react-leaflet';
import { connect } from 'dva';
import 'proj4leaflet';
import {
  startIcon,
  endIcon,
  zgdIcon,
  markerGroup,
  videoIcon,
  lastRoutesMap,
  lastSomeRoutesMap,
} from './constant/index';
import { getMeterFromPiexel } from '@/pages/fight/components/MapGL/utils/tool';
import * as util from '../../../fight/components/MapGL/utils/tool';
import {
  getCrossRegionByPath,
  getRegionNameByPoint,
} from '@/pages/fight/components/MapGL/utils/tool.js';
import Config from './config/index';
import { wgs84togcj02 } from './gpsconvert/gpsConvert';
import { createMarkers } from './listmarker/fastcluster';
import './simplemarkers/lib/Control.SimpleMarkers';
import './simplemarkers/lib/Control.SimpleMarkers.css';
import styles from './index.scss';

const { L } = window;
let lastRoutes = []; // 上一次渲染过的选路信息，如果线路相同，则不送图盟接口请求
let lastPathSteps = [];

class ConfigMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();
    this.state = {
      routeNodeRadius: 50, // 单位：米
      someRoutes: [], //  线路数组
    };
    this.lastRoutesMap = lastRoutesMap;
    this.lastSomeRoutesMap = lastSomeRoutesMap;
  }

  componentDidMount() {
    this.map = this.mapRef.current.contextValue.map;
    this.initMapEvent();
    this.resizeMap();
    lastRoutes = [];
    lastPathSteps = [];
    this.getRegionNameByPoint = getRegionNameByPoint;
    this.lastRoutesMap.clear();
    this.lastSomeRoutesMap.clear();
    // this.addVideoDevice([]);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.routes !== nextProps.routes ||
      this.state.someRoutes !== nextState.someRoutes ||
      this.props.cameraList !== nextProps.cameraList ||
      this.props.mapList !== nextProps.mapList
    );
  }

  initMapEvent() {
    this.props.dispatch({
      type: 'routeGuard/mapDraw',
      payload: {
        drawRouteMarker: this.drawRouteMarker,
      },
    });
    this.props.dispatch({
      type: 'map/resizeMap',
      payload: {
        resizeMap: this.resizeMap,
      },
    });
  }

  initDraw = icon => {
    if (!this.marker_controls) {
      this.marker_controls = new L.Control.SimpleMarkers({
        add_control: false,
        delete_control: false,
        allow_popup: true,
        marker_icon: icon,
        marker_draggable: false,
        add_marker_callback: e => {
          this.map.removeControl(this.marker_controls);
          this.marker_controls = null;
        },
      });
      this.map.addControl(this.marker_controls);
    }
  };

  drawRouteMarker = (type = 0) => {
    const icon = type === 0 ? startIcon : endIcon;
    this.initDraw(icon);
    this.marker_controls.enterAddMarkerMode();
  };

  /**
   * 线路绘制
   * @param routeLatlngs 线路坐标信息（不包括最短路线）
   * @param routeNodeRadius 途径点（圆的半径）
   * @param keyPointList 制高点
   * @param pathSteps 图盟路径数据
   * @param startEndMidway 线路数据（起点、途径点和终点)
   * @returns {*}
   */
  renderRoute({ routeLatlngs, routeNodeRadius, keyPointList, pathSteps, startEndMidway, index, color }) {
    const keyPointArray = []; // [39.940556,116.433611]测试点位
    const areaJSON = getCrossRegionByPath(pathSteps); // 经过的辖区
    const style = {
      color: '#ea4c4b',
      weight: 1,
      opacity: 0.3,
      fillOpacity: 0.1,
    };
    keyPointList &&
      keyPointList.map(item => {
        if (item.latitude && isFinite(item.latitude) && item.latitude !== '') {
          keyPointArray.push([item.latitude, item.longitude]);
        }
      });
    let routeData = [...routeLatlngs];
    // routeData.map(item => item && item[0] !== '' && item[1] !== '');
    let hasRouteData = false;
    let hasEnd = false;

    if (Array.isArray(routeData) && routeData.length >= 2) {
      hasRouteData = true;
      const endPoint = routeData[routeData.length - 1];
      hasEnd = endPoint[0] && endPoint[0] !== '' && endPoint[1] && endPoint[1] !== '';
    }
    routeData = routeData.filter(item => item[0] && item[0] !== '');
    pathSteps.map(item => {
      const [a, b] = item;
      if (Number(a) > Number(b)) {
        return item.reverse();
      }
    });

    if (pathSteps.toString() !== lastPathSteps.toString()) {
      if (this.map) {
        if (pathSteps.length > 0 && index === 0) {
          const tp = L.polyline(pathSteps);
          this.map.fitBounds(tp.getBounds());
        }
        lastPathSteps = pathSteps;
      }
    }

    let { waypoints = '' } = startEndMidway;
    waypoints = waypoints
      .split(';')
      .filter(item => item && item !== '')
      .map(item => item.split(',').reverse());
    Array.isArray(waypoints)
      ? (waypoints = waypoints.filter(item => item[0] && item[0] !== ''))
      : (waypoints = []);

    const items = hasRouteData ? (
      <div>
        {pathSteps.length > 0 ? (
          <Polyline
            positions={pathSteps || []}
            color={color}
            weight={8}
            key={`path_${pathSteps[0].length}_${index}`}
          />
        ) : null}

        {keyPointArray.map((item, index) => (
          <Marker
            position={item}
            icon={zgdIcon}
            title={'制高点'}
            key={`zgd_${index}_${item.join(',')}_${index}`}
          />
        ))}
        {waypoints.map((item, index) => (
          <Circle
            key={`${item.toString()}_${index}`}
            center={item}
            fillColor="white"
            color="#9FB9FF"
            radius={routeNodeRadius}
            fillOpacity={1}
          />
        ))}
        {areaJSON.map((item, index) => (
          <GeoJSON
            key={`area_geojson_${index}_${item.length}_${index}`}
            data={item}
            style={style}
            title={item.properties.name}
            onEachFeature={this.onEachFeature}
          >
            <Tooltip interactive={true} opacity={0.95}>
              {item.properties.name}
            </Tooltip>
          </GeoJSON>
        ))}
      </div>
    ) : (
      ''
    );
    return items;
  }

  renderSomRoutes(routes, routeNodeRadius) {
    const { carRoute, keyPointList, mapList } = this.props;
    const items = routes.reverse().map((item, index, source) => {
      const color = index === source.length - 1 ? "#06B10A" : '#797979';
      const rst = this.renderRoute({
        routeNodeRadius,
        keyPointList: keyPointList.concat(mapList),
        ...item,
        index,
        color,
      });
      console.log('renderRoute返回', rst);
      return rst;
    });
    return <Fragment>{items}</Fragment>;
  }

  renderStartEndPoint(data) {
    if (data) {
      let positionStart = [];
      let positionEnd = [];
      const {startLongitude, startLatitude, endLongitude, endLatitude} = data;
      if (startLatitude && startLongitude) {
        positionStart = [Number(startLatitude), Number(startLongitude)];
      }
      if (endLatitude && endLongitude) {
        positionEnd = [Number(endLatitude), Number(endLongitude)];
      }
      return <div>
        {positionStart.length === 2 ? <Marker position={positionStart} icon={startIcon} />: null}
        {positionEnd.length === 2 ? <Marker position={positionEnd} icon={endIcon} /> : null}
      </div>;
    } else {
      return '';
    }
  }

  /**
   * 地图大小重设
   */
  resizeMap = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.map && this.map.getSize().x === 0) {
        this.map.invalidateSize();
        clearInterval(this.interval);
      }
    }, 40);
  };

  /**
   * 监听地图缩放事件
   */
  onZoom = () => {
    if (this.map) {
      const routeNodeRadius = getMeterFromPiexel(this.map).x * 5;
      this.setState({ routeNodeRadius });
    }
  };

  /**
   * 线路数据加工
   * @param routes
   * @returns {[[*, *], ...[], [(*|string), (*|string)]]|*[]}
   */
  dealWithRoute = async (routes, index, total) => {
    if (routes[0] !== undefined) {
      const { id } = routes[0];
      const origin = [routes[0].startLatitude, routes[0].startLongitude];
      const destination = [
        routes[0].endLatitude ? routes[0].endLatitude : '',
        routes[0].endLongitude ? routes[0].endLongitude : '',
      ];
      const waypoints = [];

      if (Array.isArray(routes[0].routePoints)) {
        //============================
        // routes[0].routePoints 途径点
        //============================
        routes[0].routePoints.map((item, key) => {
          const { latitude, longitude } = item;
          if (isFinite(latitude) && isFinite(longitude) && latitude !== '' && longitude !== '') {
            waypoints.push([latitude, longitude]);
          }
        });
      }
      const lastRoutes = this.lastRoutesMap.get(`${id}_${index}`);
      console.log('lastRoutes', lastRoutes);
      const isLastRoutes = JSON.stringify(routes[0]) === JSON.stringify(lastRoutes);
      if (!isLastRoutes) {
      }
      console.log('lastRoutes', lastRoutes, isLastRoutes);
      const payload = {
        origin: [...origin].reverse().join(','),
        destination: [...destination].reverse().join(','),
        waypoints: [...waypoints].map(item => item.reverse()).join(';'),
        index,
        total,
      };
      const routeLatlngs = [origin, ...waypoints, destination];
      // 发送请求最短路径接口
      if (!isLastRoutes && destination[0] !== '') {
        const _lastRoutes = JSON.parse(JSON.stringify(routes[0]));
        this.lastRoutesMap.set(`${id}_${index}`, _lastRoutes);

        const asyncResults = await this.props.dispatch({
          type: 'map/getCarRoute',
          payload,
        });
        const { code, data } = asyncResults;
        if (code === 200) {
          console.log('dealWithRoute---1');
          const carRoute = { result: data.result, startEndMidway: payload };
          return { routeLatlngs, carRoute };
        } else {
          console.log('dealWithRoute---2');
          return { routeLatlngs, carRoute: null };
        }
      } else {
        return { routeLatlngs, carRoute: null };
      }
      console.log('dealWithRoute---3');
    }
  };

  dealWithSomeRoutes = async routes => {
    this.filterRoutes(routes);
    const result = [];
    // this.lastSomeRoutesMap.clear();
    await routes.map(async (item, index, source) => {
      const res = await this.dealWithRoute([item], index, source.length);
      if (res) {
        const {carRoute, routeLatlngs} = res;
        const pathSteps = util.getRouteSteps(carRoute);
        const {startEndMidway = {}} = carRoute || {};
        if (routeLatlngs && pathSteps.length > 0) {
          const obj = {routeLatlngs, carRoute, startEndMidway, pathSteps};
          const key = index; //JSON.stringify(startEndMidway);
          const preObj = this.lastSomeRoutesMap.get(key);
          const isSameLine = preObj && JSON.stringify(preObj.startEndMidway) === JSON.stringify(startEndMidway.toString());
          if (!preObj || !isSameLine ) {
            console.log('key', key, '数据', obj);
            this.lastSomeRoutesMap.set(key, obj);
            const someRoutes = [];
            for (const [, c] of this.lastSomeRoutesMap.entries()) {
              someRoutes.push(c);
            }
            this.setState({someRoutes});
          }
        }
      }
    })

  };

  isSameRoutes(preRoutes, routes) {
    if (preRoutes.length !== routes.length) return false;
    let rst = true;
    preRoutes.every((item, index) => {
      const { startEndMidway } = item;
      const _startEndMidway = routes[index].startEndMidway;
      rst = JSON.stringify(startEndMidway) === JSON.stringify(_startEndMidway);
      return rst;
    });
    return rst;
  }

  onEachFeature = (feature, layer) => {
    layer.on('mouseover', function() {
      this.setStyle({
        color: '#0000ff',
      });
    });
    layer.on('mouseout', function() {
      this.setStyle({
        color: '#ea4c4b',
      });
    });
  };

  /**
   * 视频设备地图撒点
   * @param deviceDataArr
   */
  addVideoDevice = deviceDataArr => {
    if (!this.map) {
      return;
    }
    const videoMarkers = this.createVideoMarkersData(deviceDataArr);
    this.createClusterMarkers(
      videoMarkers.filter(item => item.data.szType === 1),
      0, // 视频
    );
  };

  /**
   * 设备点位数据加工
   * @param deviceData 原始数据
   * @param videoJsOptions 视频播放参数
   */
  createVideoMarkersData = (deviceData, videoJsOptions = []) => {
    const videoMarkers = [];
    if (Array.isArray(deviceData)) {
      if (deviceData.length > 1000 && deviceData.length < 200) {
        // 测试数据
        let i = 0;
        while (i++ < 50000 - 1) {
          let obj = {};
          obj = Object.assign({}, deviceData[0]);
          obj.longitude = 120 + Math.random() / 1;
          obj.latitude = 30 + Math.random() / 1;
          obj.deviceId = i;
          obj.deviceName = '设备序号' + i;
          obj.szType = 1;
          obj.deviceType = Math.floor(1000 * Math.random()) % 2;
          deviceData.push(obj);
        }
      }
      // eslint-disable-next-line no-unused-vars
      deviceData.forEach((item, index) => {
        if (!item.longitude && item.deviceBean) {
          item.longitude = item.longitude || item.deviceBean.longitude;
          item.latitude = item.latitude || item.deviceBean.latitude;
        }
        if (isFinite(item.longitude) && isFinite(item.latitude)) {
          markerGroup[item.deviceId] = markerGroup[item.deviceId] || createRef();
          const lon = Number(item.longitude);
          const lat = Number(item.latitude);
          const lonlat = wgs84togcj02(lon, lat);
          item.szType = 1;
          if (lon && lat) {
            videoMarkers.push({
              position: lonlat,
              id: item.deviceId,
              data: item,
              markerRef: markerGroup[item.deviceId],
              videoJsOptions,
            });
          }
          this.markerGroup = markerGroup;
        }
      });
    }
    return videoMarkers;
  };

  createClusterMarkers(videoMarkers, deviceType) {
    if (!this.videoMarkers) {
      this.videoMarkers = [[], [], []]; // 视频 人脸 车辆
    }
    const _mks = this.videoMarkers[deviceType];
    if (Array.isArray(videoMarkers) && _mks && videoMarkers.length !== _mks.length) {
      createMarkers(
        videoMarkers,
        this.map,
        [],
        this.markerGroup,
        this.videoPlayerRef,
        this.props.dispatch,
        this.setCenter,
        deviceType,
        this,
      );
      this.videoMarkers[deviceType] = videoMarkers;
    }
  }

  filterRoutes = (routes) => {
    const arr = [];
    const list = [];
    const carRouteListLength = this.props.carRouteList.filter(item => item).length;
    // this.lastSomeRoutesMap.forEach((value, key) => {
    //   const { waypoints, destination, origin } = value.startEndMidway;
    //   let bExist = false;
    //   routes.forEach((route, index) => {
    //     const flag = list.find(cell => cell === index);
    //     if (flag === undefined) {
    //       const {routePoints, startLongitude, startLatitude, endLongitude, endLatitude} = route;
    //       const start = `${startLongitude},${startLatitude}`;
    //       const end = `${endLongitude},${endLatitude}`;
    //       let latlngs = '';
    //       routePoints.forEach(item => {
    //         const {longitude, latitude} = item;
    //         latlngs += `${longitude},${latitude}`;
    //       });
    //
    //       if (waypoints === latlngs && origin === start && destination === end) {
    //         bExist = true;
    //         list.push(index)
    //       }
    //     }
    //   });
    //   if (!bExist) {
    //     arr.push(key);
    //   }
    // });
    if (routes.length < carRouteListLength) {
      this.props.dispatch({
        type: 'map/filterCarRoute',
        payload: {
          total: routes.length
        },
      });
    }
    [0, 1, 2].slice(routes.length).forEach(key => this.lastSomeRoutesMap.delete(key));
  };

  render() {
    const { routes, cameraList = [] } = this.props;
    const { routeNodeRadius, someRoutes } = this.state;
    console.log('someRoutes', someRoutes);
    window.gmap = this;
    if (this.map && this.map.getSize().x === 0) {
      this.map.invalidateSize();
    }
    this.addVideoDevice(cameraList);
    this.dealWithSomeRoutes(routes);
    const _someRotue = [];
    this.lastSomeRoutesMap.forEach(item => item.routeLatlngs && _someRotue.push(item));
    //someRoutes.filter(item => item.routeLatlngs);
    return (
      <Map
        className={styles.mapContainer}
        center={[30.25027961206251, 120.16514401757941]} //  默认地图展示位置
        minZoom={1}
        maxZoom={18}
        zoom={14}
        crs={L.CRS.EPSG3857}
        ref={this.mapRef}
        attributionControl={false}
        onZoomend={this.onZoom}
        whenReady={() => {
          this.forceUpdate();
        }}
      >
        <TileLayer url={Config.mapUrl} />
        {this.renderSomRoutes(_someRotue, routeNodeRadius)}
        {this.renderStartEndPoint(routes[0])}
      </Map>
    );
  }
}
ConfigMap.propTypes = {};

export default connect(({ routeGuard, map }) => {
  return {
    routes: routeGuard.routes,
    keyPointList: routeGuard.keyPointList,
    carRouteList: map.carRouteList,
    cameraList: routeGuard.cameraList,
    mapList: routeGuard.mapList,
  };
})(ConfigMap);
