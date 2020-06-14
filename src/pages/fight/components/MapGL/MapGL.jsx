import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// eslint-disable-next-line import/no-extraneous-dependencies
import DeckGL from '@deck.gl/react'; // The deck.gl master module includes all submodules except for `@deck.gl/test-utils`.
import MapGL, { Layer, MapboxDraw, Source, Popup } from 'react-map-gl';
import { Editor, EditorModes, RenderStates } from 'react-map-gl-draw';
import defaultViewState from './config/defaultViewState';
import LayersControl from '@/pages/fight/components/MapGL/layersControl';
import ControlArea from '@/pages/fight/components/MapGL/controlArea';
import SelectControl from './selectControl/index';
import { getFeatureStyle, getEditHandleStyle } from './style';
import getMapStyle from './libs/getMapStyle';
import AutoSizer from './utils/AutoSizer';
import getIconLayer from './layers/getIconLayer';
import getPathLayer from './layers/getPathLayer';
import { bufferAnalyze } from './spatialAnalyze/index';
import * as util from './utils/tool';
import getGeoJsonLayer from '@/pages/fight/components/MapGL/layers/getGeoJsonLayer';
import IconClusterLayer from '@/pages/fight/components/MapGL/cluster/icon-cluster-layer.js';
import * as CONSTANT from './config/config';
import { routeInfo as __routeInfo } from './config/config';
import { gcj02towgs84, wgs84togcj02 } from '@/pages/routeGuard/components/Map/gpsconvert/gpsConvert.js';
import { getUrlParams, distanceToStart, getLengthFromRoutesAB, pointInPath } from './utils/tool';

const mapRef = createRef();
const deckRef = createRef();
const selectControlRef = createRef();
let isRendered = false;
let lastGpsCoordinates = [];
let lastGpsAngle = 0;
let lastBufferRadius = 0;
let lastBufferData = [];
let lastRenderIconData = [];
let lastBufferOrgionDataLength = 0;

class SKMapGL extends Component {
  constructor(props) {
    super(props);
    this._editorRef = null;
    this._popupRef = null;
    this.mapRef = mapRef;
    this.deckRef = deckRef;

    this.state = {
      viewport: defaultViewState,
      mode: EditorModes.READ_ONLY,
      selectedFeatureIndex: null,
      renderState: RenderStates.INACTIVE,
      closeIconData: [],
      layerVisibility: CONSTANT.layerVisibility,
      gpsIndex: 0,
      activePathIndex: 0,
      cursor: '',
    };

    this.props.dispatch({
      type: 'map/setLayerVisibility',
      payload: {
        setLayerVisibility: this.setLayerVisibility,
      },
    });
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'map/distanceToStart',
      payload: {
        distanceToStart: this._distanceToStart,
      },
    });
    dispatch({
      type: 'map/getLengthFromRoutesAB',
      payload: {
        getLengthFromRoutesAB: this._getLengthFromRoutesAB,
      }
    });
    isRendered = false;
    lastGpsCoordinates = [];
    lastGpsAngle = 0;
    lastBufferRadius = 0;
    lastBufferData = [];
    lastRenderIconData = [];
    lastBufferOrgionDataLength = 0;
    this.isDidMount = true;
  }
  componentWillUnmount() {
    this.isDidMount = false;
  }
  componentDidUpdate(prevProps, prevState) {}
  dispatch() {
    const id = getUrlParams('id');
    if (id === this.id) {
      return;
    }
    this.id = id;
    this.props.dispatch({
      type: 'map/getLayersData',
      payload: {
        routeTaskId: id, //任务id
        range: 9999, //范围 1~9999
        types: ['police', 'camera', 'alarm', 'zgdCamera'], //类型 需要显示的图层集合,不传表示查询所有
      },
    });
    this.props.dispatch({
      type: 'fight/getSecurityDetail',
      payload: { id },
    });
  }

  setViewState = viewport => {
    this.setState({ viewport });
  };

  onCloseIconClick = e => {
    this._editorRef.deleteFeatures(e.index);
    let { closeIconData } = this.state;
    closeIconData = closeIconData.filter(item => item.id !== e.object.id);
    this.setState({ closeIconData });
    this.setState({ popupCoordinates: null });
  };

  onCloseIconHover = e => {
    const cursor = e.picked ? 'Default': '';
    this.setState({ cursor });
  };


  onIconClick = e => {};

  _distanceToStart = point => {
    return distanceToStart(point, this.routePath);
  };
  _getLengthFromRoutesAB = (pointA, pointB) => {
    return getLengthFromRoutesAB(pointA, pointB, this.routePath);
  };

  _onUpdate = ({ editType, features }) => {
    if (editType === 'addFeature') {
      this.setState({
        mode: EditorModes.READ_ONLY,
      });
      this.setState({
        renderState: EditorModes.CLOSING,
      });

      const fs = this._editorRef.getFeatures();
      let lon = 0,
        lat = 0;
      let minlon = 10000,
        minlat = 10000;
      fs[fs.length - 1].geometry.coordinates[0].map(item => {
        lon = item[0] > lon ? item[0] : lon;
        lat = item[1] > lat ? item[1] : lat;
        minlon = item[0] < minlon ? item[0] : minlon;
        minlat = item[1] < minlat ? item[1] : minlat;
      });
      const { closeIconData } = this.state;
      closeIconData.push({
        coordinates: gcj02towgs84(lon, lat).reverse(),
        image: CONSTANT.cancelImg,
        width: 16,
        height: 16,
        anchorX: 8,
        anchorY: 8,
        id: new Date().getTime(),
      });
      const popupCoordinates = [(lon + minlon) / 2, (lat + minlat) / 2];
      this.setState({
        closeIconData,
        popupCoordinates,
        cursor: ''
      });
      this.props.dispatch({
        type: 'map/getBaseInfoStat',
        payload: {
          w: minlon,
          e: lon,
          s: minlat,
          n: lat,
        },
      });
    }
  };

  doSelect = () => {
    this.setState({ mode: EditorModes.DRAW_RECTANGLE, cursor: 'pointer' });
  };

  setLayerVisibility = (visibility, typeStr) => {
    const { layerVisibility } = this.state;
    layerVisibility[typeStr] = visibility;
    this.setState({ layerVisibility });
  };

  updateGPS = () => {
    setInterval(() => {
      let { gpsIndex } = this.state;
      gpsIndex++;
      this.setState({ gpsIndex });
    }, 100);
  };

  renderIconLayers(__iconData, showCluster = true, layerVisibility, viewport) {
    let iconData = __iconData.filter(item => {
      const { __type } = item.data;
      let rst = false;
      // 0 police, 1 camera, 3 zgdCamera, 4 alarm
      switch (__type) {
        case 0:
          rst = layerVisibility.police;
          break;
        case 1:
          rst = layerVisibility.video;
          break;
        case 2:
          rst = layerVisibility.zgdCamera;
          break;
        case 3:
          rst = layerVisibility.alarm;
          break;
      }
      return rst;
    });
    const layerProps = {
      data: iconData,
      pickable: true,
      wrapLongitude: true,
      getPosition: d => d.coordinates,
      iconMapping: require('@/pages/fight/components/MapGL/cluster/data/location-icon-mapping.json'),
      iconAtlas: require('@/pages/fight/components/MapGL/cluster/data/location-icon-atlas.png'),
      // onHover: this._onHover
    };
    if (mapRef && mapRef.current) {
      const zoom = mapRef.current.getMap().getZoom();
      showCluster = zoom <= 14;

      if (!showCluster) {
        const bounds = mapRef.current.getMap().getBounds();
        const n = bounds.getNorth() * 1.02;
        const s = bounds.getSouth() * 0.98;
        const w = bounds.getWest() * 0.98;
        const e = bounds.getEast() * 1.02;
        let jj = [
          [w, s],
          [e, s],
          [e, n],
          [w, n],
          [w, s],
        ];
        jj = jj.map(item => gcj02towgs84(...item).reverse());
        iconData = util.polygonSelectInFront(jj, iconData);
      }
    }
    const layer = showCluster
      ? new IconClusterLayer({ ...layerProps, id: 'icon-cluster', sizeScale: 60 })
      : getIconLayer(iconData, { onClick: this.onIconClick }, 'icon-layer', true, false)[0];
    return [layer];
  }

  renderPopup = ({
    popupCoordinates,
    cameraTotal,
    zdryTotal,
    faceTotal,
    carTotal,
    policeTotal,
    alarmTotal,
  }) => {
    return Array.isArray(popupCoordinates) && popupCoordinates.length === 2 ? (
      <Popup
        ref={_ => (this._popupRef = _)}
        longitude={popupCoordinates[0]}
        latitude={popupCoordinates[1]}
        closeButton={false}
        closeOnClick={true}
        onClose={this.closePopup}
        anchor="right"
      >
        <div>
          <p>视频设备：{cameraTotal}个</p>
          <p>重点人员：{zdryTotal}人</p>
          <p>人脸卡口：{faceTotal}个</p>
          <p>车辆卡口：{carTotal}个</p>
          <p>警力数量：{policeTotal}个</p>
          <p>警情数量：{alarmTotal}个</p>
        </div>
      </Popup>
    ) : (
      ''
    );
  };

  closePopup = () => {};

  concat({ police, camera, zgdCamera, alarm, layerVisibility }) {
    if (typeof zgdCamera === 'string') {
      zgdCamera = JSON.parse(zgdCamera.replace(/'/gi, '"'));
    }
    police = police || [];
    camera = camera || [];
    zgdCamera = zgdCamera || [];
    alarm = alarm || [];

    police.map(item => (item.__type = 0));
    camera.map(item => (item.__type = 1));
    zgdCamera.map(item => (item.__type = 2));
    alarm.map(item => (item.__type = 3));

    let rst = [];
    if (layerVisibility.police) rst = rst.concat(police);
    if (layerVisibility.video) rst = rst.concat(camera);
    if (layerVisibility.alarm) rst = rst.concat(alarm);
    if (layerVisibility.zgdCamera) rst = rst.concat(zgdCamera);
    return rst;
  }

  /**
   * 组织icon参数
   * type 警情类型 1-110 2-人脸警情
   * caseState接警状态:1分派、2签收、3到达、4反馈'
   * @param data
   * @param index
   * @returns {{image: ([*, *, *]|[*, *, *]), width: number, height: number}}
   */
  getPointImgUrl(data, index) {
    let width = 34;
    let height = 44;
    const { type, caseState, __type } = data;
    let rst = CONSTANT.pointImgUrl[__type];
    if (__type === 3 && caseState > 3) {
      rst = CONSTANT.pointImgUrl[__type + 1];
    }
    if (__type === 1) {
      width = 29;
      height = 33;
    } else if (__type === 2) {
      width = 52;
      height = 52;
    } else if (__type === 3) {
      if (type === 1) {
        rst = rst[0];
      } else if (type === 2) {
        rst = rst[1];
      } else {
        rst = rst[0];
      }
    }
    return {
      image: rst,
      width,
      height,
    };
  }

  getIconData(routes) {
    if (Array.isArray(routes) && routes.length === 0) {
      return [];
    }
    let routeInfo = Array.isArray(routes) ? routes[0].routeJson : routes.routeJson;
    routeInfo.routes = routeInfo.routes || [];
    const { originLocation = [], destinationLocation = [] } = Array.isArray(routeInfo.routes)
      ? routeInfo.routes[0] || {}
      : routeInfo.routes || {};
    const routeStartIconData = {
      ...CONSTANT.routeIconData.start,
      coordinates: [Number(originLocation.lng), Number(originLocation.lat)],
    };
    const routeEndIconData = {
      ...CONSTANT.routeIconData.end,
      coordinates: [Number(destinationLocation.lng), Number(destinationLocation.lat)],
    };
    return [routeStartIconData, routeEndIconData];
  }

  getGPSData(carPosition, carLongAndLat) {
    let gpsCoordinates = carPosition ? carLongAndLat : [];
    let gpsAngle = util.getAngle(lastGpsCoordinates, gpsCoordinates);
    if (lastGpsCoordinates.join(' ') === gpsCoordinates.join(' ')) {
      gpsAngle = lastGpsAngle;
    }
    lastGpsCoordinates = gpsCoordinates;
    lastGpsAngle = gpsAngle;

    return [
      {
        ...CONSTANT.routeCar,
        coordinates: gpsCoordinates,
        angle: gpsAngle - 90,
      },
    ];
  }

  getPathDataList(routes, activePathIndex, carLongAndLat) {
    const { zoom } = this.state.viewport;
    const pathDataList = [];
    let pathData = [];
    if (!Array.isArray(routes)) {
      routes = [routes];
    }
    let lonlat = [];
    if (carLongAndLat) {
      lonlat = wgs84togcj02(...carLongAndLat).reverse();
    }
    routes.forEach((route, index) => {
      const routePath = util.getRouteSteps({ result: route.routeJson });
      if (Array.isArray(carLongAndLat) && carLongAndLat.length === 2) {
          const rst = pointInPath(lonlat, routePath);
          const i = rst === 0 ? 0 : rst.properties.index;
          const coords = rst === 0 ? [] : rst.geometry.coordinates;
          const dataA = routePath.slice(0, i);
          const dataB = routePath.slice(i + 1);
          if (rst !== 0) {
            dataA.push(coords);
            dataB.unshift(coords);
          }
          CONSTANT.pathDataList[index].data[0].path = dataA;
          CONSTANT.pathDataList[index].data[0].color = `red`;
          CONSTANT.pathDataList[index].data[1].path = dataB;
          CONSTANT.pathDataList[index].data[1].color = '#797979';
          CONSTANT.pathDataList[index].id = 'path-layer-' + dataA.length + '-' + dataB.length + index + coords.toString();
      } else {
        CONSTANT.pathDataList[index].data[0].path = routePath;
        CONSTANT.pathDataList[index].data[0].color = '#797979';
        CONSTANT.pathDataList[index].id = 'path-layer-' + routePath.length + index;
      }
      CONSTANT.pathDataList[index].widthScale = zoom > 14 ? Math.pow( 1/ 2, Math.floor(zoom - 14)) * 4 : 10;
      if (index === activePathIndex) {
        this.routePath = routePath;
        pathData = CONSTANT.pathDataList.slice(index, index + 1);
      }
      pathDataList.push(CONSTANT.pathDataList[index]);
    });
    return { pathDataList: pathDataList.reverse(), pathData };
  }

  setBufferData(pathDataCopy, controlArea, iconData, activePathIndex) {
    const bufferData = [];
    const pathData =JSON.parse(JSON.stringify(pathDataCopy));
    if (activePathIndex < pathData.length ) {
      pathData.slice(activePathIndex, activePathIndex + 1).forEach(item => {
        const bufferRadius = parseInt(controlArea);
        const len = item.data[0].path.length + item.data[1].path.length;
        // console.log('bufferRadius, lastB', bufferRadius, lastBufferRadius);
        if (this.isDidMount && (bufferRadius === 0 || bufferRadius !== lastBufferRadius || lastBufferOrgionDataLength !== len) && len !== 0) {
          const data = [...item.data[0].path, ...item.data[1].path];
          let rst = bufferAnalyze(data, bufferRadius);
          if (rst) {
            iconData = util.polygonSelectInFront(rst.geometry.coordinates[0], iconData);
            bufferData.push(rst);
          }
          isRendered = false;
          if (iconData.length > 0) {
            lastBufferRadius = bufferRadius;
          }
          if (iconData.length >= 0) {
            lastBufferData = bufferData;
            lastRenderIconData = iconData;
          }
          lastBufferOrgionDataLength = len;
        } else if(len === 0) {
          lastBufferData = [];
          lastRenderIconData = [];
          lastBufferOrgionDataLength = 0;
        }
      });
    }
  }

  updateMapState(pathDataList) {
    const context = mapRef.current;
    const { carPosition } = this.preProps || {};
    if (!context) return;

    const map = context.getMap();
    let flag = false;
    if (!carPosition) {
      flag = true;
    } else {
      const preLonLat = carPosition.carLongAndLat;
      if (!Array.isArray(preLonLat) || preLonLat.length !== 2) {
        flag = true;
      }
    }
    const { carLongAndLat } = this.props.carPosition || {};
    if (Array.isArray(carLongAndLat) && carLongAndLat.length === 2) {
      const [lon, lat] = carLongAndLat;
      const { viewport } = this.state;
      if (flag) {
        map.setCenter(carLongAndLat);
        viewport.longitude = lon;
        viewport.latitude = lat;
        this.preProps = this.props;
      } else {
        const [preLon, preLat] = carPosition.carLongAndLat;
        if (Math.abs(lon - preLon) > 0.001 || Math.abs(lat - preLat) > 0.001) {
          mapRef.current.getMap().setCenter(carLongAndLat);
          viewport.longitude = lon;
          viewport.latitude = lat;
          this.preProps = this.props;
        }
      }
      this.state.viewport = viewport;
    }

    if (Array.isArray(pathDataList) && pathDataList.length > 0) {
      let latlngs = pathDataList[0].data.reduce((a,b) =>a.path.concat(b.path));
      latlngs = latlngs.map(([lon, lat]) => [Number(lon), Number(lat)]);
      if (latlngs.length > 1 && (!this.lastPathLength || latlngs.length !== this.lastPathLength)) {
        let l = latlngs[0], r = 0, t = 0, b = latlngs;
        latlngs.forEach(item => {
          l = item[0] > l ? l : item[0];
          r = item[0] < r ? r : item[0];
          b = item[1] > b ? b : item[1];
          t = item[1] < t ? t : item[1];
        });
        // map.fitBounds([[l, b], [r, t]]);
        this.lastPathLength = latlngs.length;
        this.bounds = [[l, b], [r, t]];
        // const zoom = map.getZoom();
        // const center = map.getZoom();
        // this.state.viewport.longitude = center[0];
        // this.state.viewport.latitude = center[1];
        // this.state.viewport.zoom = zoom;
      }
    }
  }

  render() {
    const {
      viewport,
      mode,
      renderState,
      closeIconData,
      layerVisibility,
      gpsIndex,
      popupCoordinates,
      activePathIndex,
      cursor,
    } = this.state;
    let {
      width,
      height,
      mapStyle,
      controlArea,
      layersData,
      baseInfoStat,
      taskList,
      carPosition,
      securityDetail,
      id,
    } = this.props;
    const pointerEvents = cursor === 'auto' ? 'auto': 'none';
    this.dispatch();
    const { police = [], camera = [], alarm = [], zgdCamera = [] } = layersData || {};
    const { cameraTotal, zdryTotal, faceTotal, carTotal, policeTotal, alarmTotal } =
      baseInfoStat || {};
    const { carLongAndLat } = carPosition || {};
    this.ii = this.ii || 0;
    if (window.tao && Array.isArray(carLongAndLat) && carLongAndLat.length === 2) {
      carLongAndLat[0] = carLongAndLat[0] - 0.0002 * this.ii++;
    }
    // 线路信息
    const { routes = [], preventionScope } = securityDetail || {};

    // 地图撒点数据
    let iconData = [];
    this.concat({ police, camera, zgdCamera, alarm, layerVisibility }).forEach((item, index) => {
      const { longitude, latitude } = item;
      if (latitude !== '' && latitude !== 0 && longitude !== '' && longitude !== 0) {
        iconData.push({
          coordinates: wgs84togcj02(longitude, latitude).reverse(),
          ...this.getPointImgUrl(item, index),
          data: item,
        });
      }
    });

    const routeIconData = this.getIconData(routes);
    const { pathDataList, pathData } = this.getPathDataList(routes, activePathIndex, carLongAndLat);
    const gpsIconData = this.getGPSData(carPosition, carLongAndLat);
    this.setBufferData(pathData, controlArea, iconData, activePathIndex);

    viewport.width = width;
    viewport.height = height;

    isRendered = true;
    window.gmap = this;
    this.updateMapState(pathDataList);
    return (
      <AutoSizer width={width} height={height}>
        {({ width: _width, height: _height }) => (
          <MapGL
            key="static-map"
            mapStyle={getMapStyle(mapStyle)}
            ref={mapRef}
            mapboxApiAccessToken={CONSTANT.token}
            width={_width}
            height={_height}
            useDevicePixels={false}
            {...viewport}
            onViewStateChange={({ viewState: vs }) => {
              this.setViewState(vs);
            }}
          >
            <DeckGL
              ref={deckRef}
              viewState={{...viewport}}
              layers={[
                ...getPathLayer(pathDataList),
                ...getGeoJsonLayer(lastBufferData),
                ...getIconLayer(closeIconData, { onClick: this.onCloseIconClick, onHover: this.onCloseIconHover}, 'close-icon-layer'),
                ...getIconLayer(routeIconData, { onClick: this.onIconClick }, 'route-icon-layer', true, false),
                ...getIconLayer(gpsIconData, { onClick: this.onIconClick }, 'car-icon-layer', true, true),
                ...this.renderIconLayers(lastRenderIconData, false, layerVisibility, viewport),
              ]}
            >
              <SelectControl onSelect={this.doSelect} />
              <LayersControl />
              <ControlArea />
              <Editor
                ref={_ => (this._editorRef = _)}
                style={{ width: '100%', height: '100%', cursor }}
                clickRadius={18}
                mode={mode}
                renderState={renderState}
                onSelect={this._onSelect}
                onUpdate={this._onUpdate}
                editHandleShape={'circle'}
                featureStyle={getFeatureStyle}
                editHandleStyle={getEditHandleStyle}
              />
              {this.renderPopup({
                popupCoordinates,
                cameraTotal,
                zdryTotal,
                faceTotal,
                carTotal,
                policeTotal,
                alarmTotal,
              })}
            </DeckGL>
          </MapGL>
        )}
      </AutoSizer>
    );
  }
}
export default connect(({ map, fight }) => {
  return {
    controlArea: map.controlArea,
    closeIconData: map.closeIconData,
    setLayerVisibilityFn: map.setLayerVisibilityFn,
    carRoute: map.carRoute,
    layersData: map.layersData,
    baseInfoStat: map.baseInfoStat,
    taskList: fight.taskList,
    securityDetail: fight.securityDetail,
    carPosition: fight.carPosition,
    id: fight.id,
  };
})(SKMapGL);
