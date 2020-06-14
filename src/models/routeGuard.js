import {
  getTaskList,
  getTaskNumber,
  getCarList,
  getTumengAddressSug,
  getControlList,
  addRouteTask,
  editRouteTask,
  deleteTask,
  getTaskDetail,
  getUserInfo,
  logout,
  getUserOdpsList,
  downloadMapExcel,
  downloadCameraExcel,
  getCommanderList,
  getOrganizationList,
} from '@/services/routeGuard.js';
import { taskStateList } from '@/utils/config';
import { isJSON, exportExcel } from '@/utils/tool';
import { getRegionNameByPoint } from '@/pages/fight/components/MapGL/utils/tool';
import moment from 'moment';
import { message } from 'antd';

export default {
  namespace: 'routeGuard',
  state: {
    displayName: '',
    uuid: '',
    //表格
    taskList: [],
    taskListTotal: 0,
    taskStateList: taskStateList,
    taskState: 0,
    taskDate: [],
    page: 1,
    //modal中数据
    disabled: false,
    modalVisible: false,
    stepCurrent: 0,
    //基本配置
    id: 0,
    form: {},
    carList: [], //车牌选择
    commanderList: [],
    organizationList: [],
    //起止点配置
    addressList: [],
    routes: [],
    //路线配置
    radioGroup: [{ name: '主线路', value: 0 }],
    radioValue: 0,
    //资源配置
    controlList: [],
    control: undefined,
    mapList: [],
    cameraList: [],
    jurisdictionList: [],
    userOdpsList: [],
    //暂时没用
    fileList: [],
    keyPointList: [{ longitude: '', latitude: '' }],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/deploy/routeGuard') {
          dispatch({ type: 'getTaskList' });
          dispatch({ type: 'getTaskNumber' });
          dispatch({ type: 'getOrganizationList' });
        }
      });
    },
  },
  effects: {
    *getTaskList({ payload }, { call, put, select }) {
      const { taskState, taskDate, page } = yield select(state => state.routeGuard);
      const [startTime, endTime] =
        taskDate.length === 2 ? taskDate.map(m => m.format('YYYY-MM-DD HH:mm:ss')) : ['', ''];
      const { code, message: messageText, data, total } = yield call(getTaskList, {
        state: taskState,
        startTime,
        endTime,
        page,
        size: 10,
        ...payload,
      });
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      yield put({ type: 'save', payload: { taskList: data, taskListTotal: total } });
    },
    *getUserInfo(_, { call, put }) {
      const { code, data } = yield call(getUserInfo);
      if (code !== 200) {
        // message.error(messageText);
        return;
      }
      const { displayName, uuid } = data;
      yield put({ type: 'save', payload: { displayName, uuid } });
    },
    *getTaskNumber(_, { call, put }) {
      const { code, message: messageText, data } = yield call(getTaskNumber);
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      yield put({ type: 'saveTaskStateList', payload: { data } });
    },
    *filterTaskState({ payload }, { put }) {
      const { value } = payload;
      yield put({ type: 'save', payload: { taskState: value, page: 1 } });
      yield put({ type: 'getTaskList' });
    },
    *getCarList({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(getCarList, {
        carno: '',
        page: 1,
        size: 20,
        ...payload,
      });
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          carList: data || [],
        },
      });
    },
    *getCommanderList({ payload }, { call, put }) {
      const { code, data } = yield call(getCommanderList, payload);
      if (code !== 200) return;
      // const data = Array(200)
      //   .fill()
      //   .map(_ => ({
      //     idcard: Math.floor(Math.random() * 100000),
      //     jyname: Math.floor(Math.random() * 100000),
      //   }));
      yield put({
        type: 'save',
        payload: {
          commanderList: data,
        },
      });
    },
    throttleGetCommanderList: [
      function*({ payload }, { put }) {
        yield put({ type: 'getCommanderList', payload });
      },
      { type: 'throttle', ms: 500 },
    ],
    *downloadMapExcel(_, { call, select }) {
      const { id } = yield select(state => state.routeGuard);
      const blob = yield call(downloadMapExcel, id);
      exportExcel(blob, '制高点列表.xlsx');
    },
    *downloadCameraExcel(_, { call, select }) {
      const { id } = yield select(state => state.routeGuard);
      const blob = yield call(downloadCameraExcel, id);
      exportExcel(blob, '设备列表.xlsx');
    },
    *getUserOdpsList({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(getUserOdpsList, payload);
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          userOdpsList: data,
        },
      });
    },
    throttleGetUserOdpsList: [
      function*({ payload }, { put }) {
        yield put({ type: 'getUserOdpsList', payload });
      },
      { type: 'throttle', ms: 500 },
    ],
    *getAddressList({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(getTumengAddressSug, {
        q: '',
        region: '杭州',
        ...payload,
      });
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      yield put({
        type: 'saveAddressList',
        payload: {
          data,
        },
      });
    },
    throttleGetAddressList: [
      function*({ payload }, { put }) {
        yield put({ type: 'getAddressList', payload });
      },
      { type: 'throttle', ms: 500 },
    ],
    *getControlList(_, { call, put }) {
      const { code, message: messageText, data } = yield call(getControlList);
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      yield put({
        type: 'save',
        payload: { controlList: data || [] },
      });
    },
    *completeDeploy(_, { select, put }) {
      const { id } = yield select(state => state.routeGuard);
      if (id > 0) {
        yield put({ type: 'editRouteTask' });
      } else {
        yield put({ type: 'addRouteTask' });
      }
    },
    *addRouteTask(_, { call, select, put }) {
      const {
        routeGuard: {
          form,
          routes,
          mapList,
          cameraList,
          control,
          displayName: createUser,
          uuid: createUserId,
          jurisdictionList,
        },
        map: { carRouteList },
      } = yield select(state => state);
      const payload = stateToPayload(
        form,
        routes,
        mapList,
        cameraList,
        control,
        carRouteList,
        jurisdictionList,
      );
      const { code, message: messageText } = yield call(addRouteTask, {
        ...payload,
        createUser,
        createUserId,
      });
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      message.success(messageText);
      yield put({ type: 'resetAddTaskForm' });
      yield put({ type: 'getTaskList' });
      yield put({ type: 'getTaskNumber' });
    },
    *editRouteTask(_, { call, select, put }) {
      const {
        routeGuard: { id, form, routes, mapList, cameraList, control, jurisdictionList },
        map: { carRouteList },
      } = yield select(state => state);
      const payload = stateToPayload(
        form,
        routes,
        mapList,
        cameraList,
        control,
        carRouteList,
        jurisdictionList,
      );
      const { code, message: messageText } = yield call(editRouteTask, { id, ...payload });
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      message.success(messageText);
      yield put({ type: 'resetAddTaskForm' });
      yield put({ type: 'getTaskList' });
    },
    *deleteTask({ payload }, { call, put }) {
      const { code, message: messageText } = yield call(deleteTask, payload.id);
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      message.success(messageText);
      yield put({ type: 'getTaskList' });
      yield put({ type: 'getTaskNumber' });
    },
    *getTaskDetail({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(getTaskDetail, payload.id);
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      yield put({ type: 'saveAddTaskForm', payload: { data } });
      yield put({ type: 'save', payload: { disabled: true } });
    },
    *editTaskDetail({ payload }, { call, put }) {
      const { code, message: messageText, data } = yield call(getTaskDetail, payload.id);
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      yield put({ type: 'saveAddTaskForm', payload: { data } });
    },
    *logout(_, { call }) {
      const { code, message: messageText, data } = yield call(logout);
      if (code !== 200) {
        message.error(messageText);
        return;
      }
      window.location.href = data;
    },
    *getOrganizationList(_, { call, put }) {
      const { code, data } = yield call(getOrganizationList);
      if (code !== 200) return;
      yield put({ type: 'save', payload: { organizationList: data } });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveTaskStateList(state, { payload }) {
      const data = payload.data || {};
      const { notExecute = 0, executed = 0, executing = 0 } = data;
      const { taskStateList } = state;
      taskStateList[0].number = notExecute;
      taskStateList[1].number = executing;
      taskStateList[2].number = executed;
      return {
        ...state,
        taskStateList: [...taskStateList],
      };
    },
    saveStartEndPoint(state, { payload }) {
      const { key, value } = payload;
      const {
        name,
        location: { lng, lat },
      } = JSON.parse(value);
      const { routes } = state;
      if (!routes[0]) routes[0] = {};
      routes[0][key] = name;
      routes[0][`${key}Longitude`] = lng;
      routes[0][`${key}Latitude`] = lat;
      return {
        ...state,
        routes: [...routes],
      };
    },
    addRoute(state) {
      const { radioGroup, routes } = state;
      const length = radioGroup.length;
      const newRadioGroup = [...radioGroup, { name: `备用线路${length}`, value: length }];
      const newRoutes = [...routes, JSON.parse(JSON.stringify(routes[0]))];
      return {
        ...state,
        radioGroup: newRadioGroup,
        radioValue: length,
        routes: newRoutes,
      };
    },
    removeRoute(state) {
      const { radioGroup, routes } = state;
      const length = radioGroup.length;
      const newRadioGroup = [...radioGroup];
      newRadioGroup.pop();
      const newRoutes = [...routes];
      newRoutes.pop();
      return {
        ...state,
        radioGroup: newRadioGroup,
        radioValue: length - 2,
        routes: newRoutes,
      };
    },
    insertRoutePoints(state, { payload }) {
      const { routePoints, index } = payload;
      const { routes, radioValue } = state;
      routePoints.splice(index, 0, { name: '', longitude: '', latitude: '' });
      routes[radioValue].routePoints = routePoints; //防止第一次没有routePoints字段
      return {
        ...state,
        routes: [...routes],
      };
    },
    deleteRoutePoints(state, { payload }) {
      const { routePoints, index } = payload;
      const { routes, radioValue } = state;
      routePoints.splice(index, 1);
      routes[radioValue].routePoints = routePoints; //防止第一次没有routePoints字段
      return {
        ...state,
        routes: [...routes],
      };
    },
    saveRoutePointName(state, { payload }) {
      const { routePoints, value, index } = payload;
      const { routes } = state;
      const {
        name,
        location: { lng, lat },
      } = JSON.parse(value);
      routePoints[index].name = name;
      routePoints[index].longitude = lng;
      routePoints[index].latitude = lat;
      return {
        ...state,
        routes: [...routes],
      };
    },
    insertKeyPoint(state, { payload }) {
      const { index } = payload;
      const keyPointList = [...state.keyPointList];
      keyPointList.splice(index, 0, { longitude: '', latitude: '' });
      return {
        ...state,
        keyPointList,
      };
    },
    deleteKeyPoint(state, { payload }) {
      const { index } = payload;
      const keyPointList = [...state.keyPointList];
      keyPointList.splice(index, 1);
      return {
        ...state,
        keyPointList,
      };
    },
    saveKeyPoint(state, { payload }) {
      const { type, value, index } = payload;
      const keyPointList = [...state.keyPointList];
      keyPointList[index][type] = value;
      return {
        ...state,
        keyPointList,
      };
    },
    saveAddressList(state, { payload }) {
      const { data } = payload;
      let addressList = [];
      if (typeof data === 'string' && data.length > 0)
        ({ results: addressList = [] } = JSON.parse(data));
      else {
        ({ results: addressList } = data);
      }
      return {
        ...state,
        addressList: addressList.slice(0, 20),
      };
    },
    resetAddTaskForm(state) {
      return {
        ...state,
        modalVisible: false,
        id: 0,
        stepCurrent: 0,
        disabled: false,
        form: {},
        carList: [], //车牌选择
        //起止点配置
        addressList: [],
        routes: [],
        radioGroup: [{ name: '主线路', value: 0 }],
        radioValue: 0,
        //资源配置
        ccontrolList: [],
        control: undefined,
        mapList: [],
        cameraList: [],
        userOdpsList: [],
        jurisdictionList: [],
        // keyPointList: [{ longitude: '', latitude: '' }],
      };
    },
    saveAddTaskForm(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        modalVisible: true,
        ...resToState(data),
      };
    },
    saveJurisdictionList(state) {
      const { routes, jurisdictionList } = state;
      const tempSet = new Set();
      const newJurisdictionList = [];
      routes
        .reduce(
          (prev, curr) => [
            ...prev,
            getRegionNameByPoint([[curr.startLongitude, curr.startLatitude]]),
            getRegionNameByPoint([[curr.endLongitude, curr.endLatitude]]),
            ...(curr.routePoints
              ? curr.routePoints.map(obj => getRegionNameByPoint([[obj.longitude, obj.latitude]]))
              : []),
          ],
          [],
        )
        .forEach(obj => {
          // console.log(obj);
          if (!tempSet.has(obj.name)) {
            tempSet.add(obj.name);
            const findRes = jurisdictionList.find(sub => sub.name === obj.name);
            if (findRes) newJurisdictionList.push(findRes);
            else newJurisdictionList.push(obj);
          }
        });
      return {
        ...state,
        jurisdictionList: newJurisdictionList,
      };
    },
    editJurisdictionList(state, { payload }) {
      const { value, index } = payload;
      const jurisdictionList = [...state.jurisdictionList];
      jurisdictionList[index].value = value;
      return {
        ...state,
        jurisdictionList,
      };
    },
  },
};

const stateToPayload = (
  {
    taskName,
    taskLevel,
    startEndTime,
    commander,
    frontCar,
    gpsCode,
    videoCode,
    controlRange,
    sharedObject,
  },
  routes,
  mapList,
  cameraList,
  control = {},
  carRouteList,
  jurisdictionList,
) => {
  const [temp1, temp2] = startEndTime;
  const startTime = temp1.format('YYYY-MM-DD HH:mm:ss');
  const endTime = temp2.format('YYYY-MM-DD HH:mm:ss');
  const frontCarObj = isJSON(frontCar) ? JSON.parse(frontCar) : {};
  const { radio, input } = controlRange;
  // const routeJson = carRoute && carRoute.result ? JSON.stringify(carRoute.result || {}) : '{}';
  const newRoutes = routes.map((obj, index) => {
    const routePoints = (obj.routePoints || []).map(obj => ({
      ...obj,
      jurisdiction:
        getRegionNameByPoint([[obj.longitude, obj.latitude]]) &&
        getRegionNameByPoint([[obj.longitude, obj.latitude]]).name,
    }));
    const routeJson =
      carRouteList && carRouteList[index] && carRouteList[index].result
        ? JSON.stringify(carRouteList[index].result)
        : '{}';
    const startJurisdiction =
      getRegionNameByPoint([[obj.startLongitude, obj.startLatitude]]) &&
      getRegionNameByPoint([[obj.startLongitude, obj.startLatitude]]).name;
    const endJurisdiction =
      getRegionNameByPoint([[obj.endLongitude, obj.endLatitude]]) &&
      getRegionNameByPoint([[obj.endLongitude, obj.endLatitude]]).name;
    return {
      ...obj,
      routePoints,
      routeJson,
      startJurisdiction,
      endJurisdiction,
      type: '0',
      useable: 1,
    };
  });
  const { key, label } = control;
  const [commanderName, phonenumber] = commander ? commander.split('/') : [];
  const shareObjectJson = sharedObject && JSON.stringify(sharedObject);
  return {
    name: taskName,
    level: taskLevel,
    firstCarNo: frontCarObj.carno,
    firstCarId: gpsCode,
    shareObjectJson,
    // lastCarNo: '浙B12345',
    // lastCarId: '12b456',
    // temporaryDeviceId: 'tempDeviceId2',
    preventionScope: input || radio,
    commander: commanderName,
    phonenumber,
    // share: '[]',
    state: 0,
    startTime: startTime,
    endTime: endTime,
    // createUser: 'jiangxx',
    // createUserId: 'userId1234',
    zgdCameras: JSON.stringify(mapList),
    routeCameraPreconfigureds: cameraList,
    firstCarCameraCode: videoCode,
    spznSpecialCode: key,
    spznSpecialName: label,
    routes: newRoutes,
    jurisdictionPrincipal: JSON.stringify(jurisdictionList),
  };
};

const resToState = data => {
  const {
    id,
    name,
    level,
    firstCarNo,
    firstCarId,
    shareObjectJson,
    preventionScope,
    commander,
    phonenumber,
    startTime,
    endTime,
    zgdCameras,
    firstCarCameraCode,
    spznSpecialCode,
    spznSpecialName,
    routes,
    jurisdictionPrincipal,
  } = data;
  const startEndTime = [moment(startTime), moment(endTime)];
  const controlRange =
    preventionScope === 1000
      ? { radio: 1000, input: preventionScope }
      : { radio: preventionScope, input: '' };
  const sharedObject = isJSON(shareObjectJson) ? JSON.parse(shareObjectJson) : undefined;
  // console.log(sharedObject);
  const form = {
    taskName: name,
    taskLevel: level,
    frontCar: firstCarNo,
    gpsCode: firstCarId,
    videoCode: firstCarCameraCode,
    startEndTime,
    commander: `${commander}/${phonenumber}`,
    controlRange,
    sharedObject,
  };
  const mapList = isJSON(zgdCameras) ? JSON.parse(zgdCameras) : [];
  const control =
    spznSpecialCode && spznSpecialName
      ? { key: spznSpecialCode, label: spznSpecialName }
      : undefined;
  const radioGroup = [...routes].map((_, index) => {
    if (index === 0) return { name: '主线路', value: 0 };
    else return { name: `备用线路${index}`, value: index };
  });
  const cameraList = routes.reduce(
    (prev, curr) => [...prev, ...curr.routeCameraPreconfigureds],
    [],
  );
  const jurisdictionList = isJSON(jurisdictionPrincipal) ? JSON.parse(jurisdictionPrincipal) : [];
  return {
    id,
    form,
    mapList,
    cameraList,
    control,
    routes,
    radioGroup,
    jurisdictionList,
  };
};
