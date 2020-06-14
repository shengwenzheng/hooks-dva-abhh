import { isJSON, timeFormat } from '@/utils/tool';
import { getLengthFromRoutesABEx } from '../pages/fight/components/MapGL/utils/tool';

import {
  getSecurityList,
  getSecurityDetail,
  taskStart,
  taskFinish,
  getAlermList,
  getTaskCount,
  getCarPosition,
  getPoliceCount,
  firstCarCommander,
  getRouteVideo,
  setRouteStatus,
  getCommander,
  getServerStamp,
  editRecordScreen,
} from '@/services/fight';
import { message } from 'antd';
import moment from 'moment';
import _ from 'lodash';

export default {
  namespace: 'fight',
  state: {
    id: '',
    leftMenuVisible: false,
    confirmLicensePlateModalVisible: false,
    openComfirmModalVisible: false,
    controlAlarmModalVisible: false,
    alarm110ModalVisible: false,
    taskList: [],
    securityDetail: null,
    originalSecurityDetail: {},
    controlArea: 100,
    taskStatus: 'no',
    alermList: [],
    policeCount: '--',
    alarmSingle: null,
    taskCount: null,
    carPosition: null,
    carCommander: {},
    videoData: null,
    surplus: 0,
    keepTime: '--',
    surplusTime: '--',
    surplusDistance: '--',
    alarmAllModalVisible: false,
    commanderList: [],
    systemStart: '',
    carStart: '',
    carArriveTime: '',
    systemClose: '',
    serverStamp: '',
    clearAllTimer: () => {}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/fight') {
          dispatch({ type: 'getSecurityList' });
          dispatch({ type: 'getTaskCount' });
          dispatch({ type: 'save', payload: { id: history.location.query.id } });
        }
      });
    },
  },
  effects: {
    *getSecurityList(_, { call, put }) {
      const { code, message: messageText, data } = yield call(getSecurityList);
      if (!(code === 200)) {
        console.log('getSecurityList failed, Error: ', messageText)
        // message.error(messageText);
        return;
      }
      yield put({
        type: 'saveSecurityList',
        payload: {
          data,
        },
      });
    },
    *setControlArea({ payload }, { put }) {
      yield put({
        type: 'saveControlArea',
        payload: {
          mapData: payload.controlArea,
        },
      });
    },
    *getSecurityDetail({ payload }, { call, put, select }) {
      const { code, message: messageText, data } = yield call(getSecurityDetail, payload.id);
      if (!(code === 200)) {
        console.log('getSecurityDetail failed, Error: ', messageText)
        // message.success(messageText);
        return;
      }
      yield put({
        type: 'save',
        payload: { originalSecurityDetail: _.cloneDeep(data) },
      });
      yield put({
        type: 'saveSecurityDetail',
        payload: {
          data,
        },
      });
      if (data.routeStatus && data.routeStatus < 100) {
        yield put({
          type: 'getPoliceCount',
        });
      }
    },
    *getServerStamp({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(getServerStamp);
      if (!(code === 200)) {
        console.log('getServerStamp failed, Error: ', messageText)
        // message.error(messageText);
        return;
      }
      yield put({ type: 'save', payload: { serverStamp: data } });
    },
    *taskStart({ payload }, { call, put }) {
      const { id } = payload;
      const { code, message: messageText } = yield call(taskStart, id);
      if (!(code === 200)) {
        console.log('taskStart failed, Error: ', messageText)
        // message.info(messageText);
      } else {
        message.success('已为你切换到当前车队画面');
      }
      yield put({
        type: 'saveTaskStatus',
        payload: {
          taskStatus: 'ready',
        },
      });
      yield put({
        type: 'getSecurityDetail',
        payload: { id: payload.id },
      });
    },
    *taskFinish({ payload }, { call, put }) {
      const { code, message: messageText } = yield call(taskFinish, payload.id);
      if (!(code === 200)) {
        console.log('taskFinish failed, Error: ', messageText)
        // message.success(messageText);
        return;
      }
      yield put({
        type: 'saveTaskStatus',
        payload: {
          taskStatus: 'over',
        },
      });
    },
    *getAlermList({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(getAlermList, payload.id);
      if (!(code === 200)) {
        console.log('getAlermList failed, Error: ', messageText)
        // message.success(messageText);
        return;
      }
      yield put({
        type: 'saveAlermList',
        payload: {
          data,
        },
      });
    },
    *getTaskCount(_, { call, put }) {
      const { code, message: messageText, data } = yield call(getTaskCount);
      if (!(code === 200)) {
        console.log('getTaskCount failed, Error: ', messageText)
        // message.success(messageText);
        return;
      }
      yield put({
        type: 'saveTaskCount',
        payload: {
          data,
        },
      });
    },
    *getCarPosition({ payload }, { call, put, select }) {
      const { distanceToStartFn } = yield select(state => state.map);

      const { code, message: messageText, data } = yield call(getCarPosition, payload);
      if (!data) {
        console.log('getCarPosition failed, Error: ', messageText)
        // message.success(messageText);
        return;
      }
      const carDistance = yield call(distanceToStartFn, [data.longitude, data.latitude]);
      const carLongAndLat = [data.longitude, data.latitude];
      const carSpeed = data.speed || 50;
      yield put({
        type: 'saveCarDistance',
        payload: {
          carSpeed,
          carDistance,
          carLongAndLat,
        },
      });
    },
    *getPoliceCount(_, { call, put, select }) {
      const { securityDetail } = yield select(state => state.fight);
      let params = {
        routeTaskId: securityDetail.id,
        range: securityDetail.preventionScope,
      };
      const { code, message: messageText, data } = yield call(getPoliceCount, params);
      if (!(code === 200)) {
        console.log('getPoliceCount failed, Error: ', messageText)
        // message.success(messageText);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          policeCount: data,
        },
      });
    },
    *firstCarCommander({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(firstCarCommander, payload);
      if (!(code === 200)) {
        console.log('firstCarCommander failed, Error: ', messageText)
        // message.error(messageText);
        return;
      }
      yield put({
        type: 'saveFirstCarCommander',
        payload: {
          code,
        },
      });

      yield put({
        type: 'getSecurityDetail',
        payload: { id: payload.id },
      });
    },
    *getRouteVideo({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(getRouteVideo, payload.id);
      if (!(code === 200)) {
        console.log('getRouteVideo failed, Error: ', messageText)
        // message.error(messageText);
        return;
      }
      yield put({
        type: 'saveRouteVideo',
        payload: {
          data,
        },
      });
    },
    *setRouteStatus({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(setRouteStatus, payload);
      if (!(code === 200)) {
        console.log('setRouteStatus failed, Error: ', messageText)
        // message.error(messageText);
        return;
      }

      yield put({
        type: 'getSecurityDetail',
        payload: { id: payload.id },
      });
    },
    *getCommander({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(getCommander, payload);
      if (!(code === 200)) {
        console.log('getCommander failed, Error: ', messageText)
        // message.error(messageText);
        return;
      }
      yield put({ type: 'save', payload: { commanderList: data } });
    },
    *setNorm({ payload }, { call, put, select }) {
      yield put({
        type: 'saveNorm',
        payload: { securityDetail: payload },
      });
    },
    *editRouteTask(_, { call, select }) {
      const {
        fight: { id },
        routeGuard: { displayName },
      } = yield select(state => state);
      const recordScreenPath = `${displayName}于${moment().format(
        'YYYY-MM-DD HH:mm:ss',
      )}进行了录屏操作,请去对应账号当时进行“录屏”操作的电脑中查看.`;
      const { code, message: messageText } = yield call(editRecordScreen, {
        id,
        recordScreenPath,
        recordScreenEnable: 1,
      });
      if (code !== 200) {
        message.error(messageText);
        return;
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveAlarmSingle(state, { payload }) {
      let alarmSingle = null;
      if (state.alermList) {
        state.alermList.forEach(value => {
          if (value.id === payload.id) {
            alarmSingle = value;
          }
        });
      }
      return {
        ...state,
        ...payload,
        alarmSingle,
      };
    },
    saveSecurityList(state, { payload }) {
      const { data } = payload;
      const taskList = [{ name: '路线警卫', children: data.routeTasks }];
      return {
        ...state,
        taskList,
      };
    },
    saveClearTimerFn(state, {payload}) {
      const { clearAllTimer } = payload;
      return {
        ...state,
        clearAllTimer,
      };
    },
    saveControlArea(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveSecurityDetail(state, { payload }) {
      const { data } = payload;
      data.routes = data.routes[0]; //正式配置时只有一个线路图

      const startLatitude = data.routes.startLatitude;
      const startLongitude = data.routes.startLongitude;
      const endLatitude = data.routes.endLatitude;
      const endLongitude = data.routes.endLongitude;
      if (data.routes.routeJson) {
        data.routes.routeJson = isJSON(data.routes.routeJson)
          ? JSON.parse(data.routes.routeJson)
          : {};
        // routeJson里的distance作为总距离
        data.routes['totalDistance'] =
          (data.routes.routeJson['routes'] &&
            data.routes.routeJson['routes'][0] &&
            data.routes.routeJson['routes'][0].distance / 1000) ||
          getLengthFromRoutesABEx([startLongitude, startLatitude], [endLongitude, endLatitude], data);
      }
      let keepTime = '- 分 - 秒';
      let speed = 50;
      let pointDistanceFromStart = 0;
      let arrTemp = data.routes.routePoints || [];
      arrTemp.forEach((value, key, arr) => {
        let dis = 0;
        if (key === 0) {
          dis =
            getLengthFromRoutesABEx(
              [startLongitude, startLatitude],
              [value.longitude, value.latitude],
              data
            ) / 1000;
        } else {
          dis =
            getLengthFromRoutesABEx(
              [arr[key - 1].longitude, arr[key - 1].latitude],
              [value.longitude, value.latitude],
              data
            ) / 1000;
        }
        pointDistanceFromStart += dis;
        // pointDistance表示的是当前途径点距离前一个途径点的距离
        value['pointDistance'] = dis;
        value['pointDistanceFromStart'] = pointDistanceFromStart;
      });
      let surplusDistance = '--';
      let surplusTime = '- 分 - 秒';
      let systemStart = '';
      let carStart = '';
      let carArriveTime = '';
      let systemClose = '';
      let taskStatus = 'no';
      data.hasCommanderCarInfo = data.firstCarNo !== '' && data.commander !== '';
      const routeStatusRecords = data.routeStatusRecords;
      routeStatusRecords.forEach(value => {
        if (value.status === 1) {
          systemStart = value.executeTime;
        } else if (value.status === 2) {
          carStart = value.executeTime;
        } else if (value.status === 3) {
          carArriveTime = value.executeTime;
        } else if (value.status > 3) {
          systemClose = value.executeTime;
        }
      });
      const d = new Date();
      let diff = d.getTime() - moment(carStart).valueOf();
      diff = diff < 0 ? 0 : diff;
      let hasMileage = ((diff / 1000 / 3600) * speed).toFixed();
      let carDriveDiff = moment(carArriveTime).valueOf() - moment(carStart).valueOf();
      hasMileage = hasMileage > data.routes.mileage ? data.routes.mileage : hasMileage;
      // if (!data.hasCommanderCarInfo) {
      //   // taskStatus = 'config';
      // } else
      if (data.routeStatus === 1) {
        taskStatus = 'ready';
      } else if (data.routeStatus === 2) {
        taskStatus = 'in';
        keepTime = timeFormat(diff);
      } else if (data.routeStatus === 3) {
        taskStatus = 'arrive';
        surplusDistance = 0;
        surplusTime = 0;
        keepTime = timeFormat(carDriveDiff);
      } else if (data.routeStatus > 3) {
        taskStatus = 'over';
        surplusTime = 0;
        surplusDistance = 0;
        keepTime = timeFormat(carDriveDiff);
      }
      const securityDetail = data;
      return {
        ...state,
        securityDetail,
        taskStatus,
        keepTime,
        systemStart,
        carStart,
        carArriveTime,
        systemClose,
        surplusDistance,
        surplusTime
      };
    },
    saveFirstCarNo(state, { payload }) {
      const securityDetail = { ...state.securityDetail };
      securityDetail.firstCarNo = payload.carno;
      securityDetail.firstCarId = payload.deviceId;
      return {
        ...state,
        securityDetail,
      };
    },
    saveCommander(state, { payload }) {
      const securityDetail = { ...state.securityDetail };
      securityDetail.commander = payload;
      return {
        ...state,
        securityDetail,
      };
    },
    saveTaskStatus(state, { payload }) {
      let taskStatus = payload.taskStatus;
      return {
        ...state,
        taskStatus,
      };
    },
    saveAlermList(state, { payload }) {
      const alermList = payload.data || [];
      return {
        ...state,
        alermList,
      };
    },
    saveTaskCount(state, { payload }) {
      const taskCount = payload.data.executing;
      return {
        ...state,
        taskCount,
      };
    },
    saveCarDistance(state, { payload }) {
      const { carDistance, carLongAndLat, carSpeed } = payload;
      const totalDis =
        state.securityDetail.routes.routeJson.routes.length > 0 &&
        state.securityDetail.routes.routeJson.routes[0].distance;
      const carPosition = {
        carSpeed,
        totalDis,
        carDistance,
        carLongAndLat,
      };
      return {
        ...state,
        carPosition,
      };
    },
    saveFirstCarCommander(state, { payload }) {
      const confirmLicensePlateModalVisible = payload.code !== 200;
      return {
        ...state,
        confirmLicensePlateModalVisible,
      };
    },
    saveRouteVideo(state, { payload }) {
      const videoData = payload.data;
      return {
        ...state,
        videoData,
      };
    },
    saveNorm(state, { payload }) {
      const d = new Date();
      const serverStamp = state.serverStamp.timeStamp || d.getTime();
      const securityDetail = payload.securityDetail;
      const carLongAndLat = state.carPosition && state.carPosition.carLongAndLat;
      const startLatLong = [securityDetail.startLongitude, securityDetail.startLatitude];
      const endLatLong = [securityDetail.endLongitude, securityDetail.endLatitude];

      // if (securityDetail && securityDetail.state !== 1) return {...state};
      let speed =
        (state.carPosition && state.carPosition.carSpeed && state.carPosition.carSpeed) || 50;
      let diff = serverStamp - moment(state.carStart || serverStamp).valueOf();
      diff = diff < 0 ? 0 : diff;
      const keepTime = timeFormat(diff);

      const totalDistance = securityDetail.routes.totalDistance;
      // 剩余公里
      let mileage = totalDistance;
      if (carLongAndLat && carLongAndLat.length) {
        mileage = getLengthFromRoutesABEx(carLongAndLat, endLatLong, securityDetail) / 1000;
      }
      // 防止误差，已totalDistance为准
      mileage = mileage > totalDistance ? totalDistance : mileage;

      // 剩余时间
      let surplus = (mileage / speed) * 3600 * 1000;
      surplus = surplus === Infinity ? 0 : surplus;
      let surplusTime = timeFormat(surplus);
      let surplusDistance = (mileage && mileage.toFixed(1)) || 0;
      return {
        ...state,
        keepTime,
        surplus,
        surplusTime,
        surplusDistance,
      };
    },
  },
};

function rad(d) {
  return (d * Math.PI) / 180.0; //经纬度转换成三角函数中度分表形式。
}

function getDistance(lat1, lng1, lat2, lng2) {
  //参数分别为第一点的纬度，经度；第二点的纬度，经度
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = Math.abs(radLat1 - radLat2);
  var b = Math.abs(rad(lng1) - rad(lng2));
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2),
      ),
    );
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000; //输出为公里
  //s=s.toFixed(4);
  return s;
}

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
