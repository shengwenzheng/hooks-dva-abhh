import request from '@/utils/request';

export function getSecurityList(params) {
  return request.post(`/abhh/api/security/list`, { data: params });
}

export function getSecurityDetail(id) {
  return request.post(`/abhh/api/routeTask/detail/${id}`);
}

export function taskStart(id) {
  return request.post(`/abhh/api/routeTask/start/${id}`);
}

export function taskFinish(id) {
  return request.post(`/abhh/api/routeTask/finish/${id}`);
}

export function getAlermList(id) {
  return request.post(`/abhh/api/alarm/list/routeId/${id}`);
}

export function getTaskCount() {
  return request.get(`/abhh/api/routeTask/number`);
}

export function getCarPosition(deviceId) {
  return request.post(`/abhh/api/deviceGps/gps/${deviceId}`);
}

export function getPoliceCount(params) {
  return request.post(`/abhh/api/routeTask/police/count`, { data: params });
}

export function firstCarCommander(params) {
  return request.put(`/abhh/api/routeTask/firstCarCommander`, { data: params });
}

export function getPointInfo({ s, n, w, e }) {
  return request.get(`/abhh/api/baseInfoStat/rect/${w}/${e}/${s}/${n}`);
}

export function getRouteVideo(routeTaskid) {
  return request.post(`/abhh/api/routeTask/play/regulate/${routeTaskid}`);
}

export function getBaseInfoStat({ s, n, w, e }) {
  return request.get(`/abhh/api/baseInfoStat/rect/${w}/${e}/${s}/${n}`);
}

export function getLayersData(params) {
  return request.post('/abhh/api/deviceGps/gps/gis/layer', { data: params });
}

export function setRouteStatus(data) {
  return request.post(`/abhh/api/routeTask/routeStatus/${data.id}/${data.routeStatus}`);
}

export function getCommander(data) {
  return request.post('/abhh/api/hzosUserOdps/list', { data });
}

export function getServerStamp() {
  return request.post('/abhh/api/security/system/timeStamp');
}

export function editRecordScreen(data) {
  return request.put('/abhh/api/routeTask/recordScreen', { data });
}
