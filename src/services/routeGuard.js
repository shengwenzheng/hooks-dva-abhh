import request from '@/utils/request';
import { ak } from '@/utils/config';

export function getUserInfo() {
  return request.get(`/abhh/getuserdetailinfo`);
}
export function getTaskList(data) {
  return request.post(`/abhh/api/routeTask/list`, { data });
}
export function getTaskNumber() {
  return request.get(`/abhh/api/routeTask/number`);
}
export function deleteTask(id) {
  return request.delete(`/abhh/api/routeTask/${id}`);
}
export function modifyTask(data) {
  return request.put(`/abhh/api/routeTask`, { data });
}
export function getCarList(data) {
  return request.post(`/abhh/api/deviceGps/list`, { data });
}
export function getTumengAddressSug(data) {
  return request.get(`/abhh/api/redirect/tumeng/as/sug`, { params: { ...data, ak } });
}
export const uploadCameraExcel =
  '/abhh/api/routeTask/uploadFileIdentificationPre/import/excel/camera';

export const uploadMapExcel =
  '/abhh/api/routeTask/uploadFileIdentificationPre/import/excel/HighestPoint';

export function downloadCameraExcel(id) {
  return request.get(
    `/abhh/api/routeTask/downloadFileIdentificationPre/export/excel/camera/${id}`,
    {
      responseType: 'blob',
    },
  );
}
export function downloadMapExcel(id) {
  return request.get(
    `/abhh/api/routeTask/downloadFileIdentificationPre/export/excel/HighestPoint/${id}`,
    {
      responseType: 'blob',
    },
  );
}
export function getControlList() {
  return request.get(`/abhh/api/routeTask/special/dict`);
}
export function addRouteTask(data) {
  return request.post(`/abhh/api/routeTask`, { data });
}
export function editRouteTask(data) {
  return request.put(`/abhh/api/routeTask`, { data });
}
export function getTaskDetail(id) {
  return request.post(`/abhh/api/routeTask/detail/${id}`);
}
export function getCarRoute({ origin, destination, waypoints }) {
  return request.get(`/abhh/api/redirect/tumeng/as/route/car?origin=${origin}&destination=${destination}&waypoints=${waypoints}
        &output=json&ak=ec85d3648154874552835438ac6a02b2`);
}
export function logout() {
  return request.get('/abhh/api/logout');
}
export function getUserOdpsList({ keyword, deptCode }) {
  return request.get(`/abhh/api/common/list/person?deptCode=${deptCode}&keyword=${keyword}`);
}
export function getCommanderList(data) {
  return request.post('/abhh/api/hzosUserOdps/list', { data });
}
export function getOrganizationList() {
  return request.get('/abhh/api/organization');
}
