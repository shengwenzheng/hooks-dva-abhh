const { L } = window;
const startIcon = L.icon({
  iconUrl: require(`@/assets/img/startPoint.png`),
  iconSize: [26, 37],
  iconAnchor: [13, 37],
  popupAnchor: [0, -233],
});
const endIcon = L.icon({
  iconUrl: require(`@/assets/img/endPoint.png`),
  iconSize: [26, 37],
  iconAnchor: [13, 37],
  popupAnchor: [0, -233],
});
const zgdIcon = L.icon({
  iconUrl: require(`@/assets/img/zgd.png`),
  iconSize: [23, 23],
  iconAnchor: [25, 25],
  popupAnchor: [0, -233],
});

// 存放摄像头marker点， { deviceId: marker }
const markerGroup = [];
// 摄像头图标参数
const videoIcon = new L.Icon({
  iconUrl: require('@/assets/img/map/camera.png'),
  iconAnchor: [16, 16],
  popupAnchor: [10, -44],
  iconSize: [32, 32],
});
const videoSelectedIcon = new L.Icon({
  iconUrl: require('@/assets/img/map/camera-selected.png'),
  iconAnchor: [16, 16],
  popupAnchor: [10, -44],
  iconSize: [32, 32],
});

const lastRoutesMap = new Map();
const lastSomeRoutesMap = new Map();

export {
  startIcon,
  endIcon,
  zgdIcon,
  markerGroup,
  videoIcon,
  videoSelectedIcon,
  lastRoutesMap,
  lastSomeRoutesMap,
};
