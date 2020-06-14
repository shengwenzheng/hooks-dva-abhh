import React, { Component } from 'react';
import CarInfo from './carInfo';
import PointInfo from './pointInfo';
import LineInfo from './lineInfo';
import Jurisdiction from './jurisdiction';
import CrossPoint from './crossPoint'
import styles from './index.scss';
import { connect } from 'dva';
import { point } from 'leaflet';
import hornImg from '@/assets/img/horn.png';
import arrowLinkImg from '@/assets/img/arrow-link.png';

@connect(({ fight: { carPosition, securityDetail, surplus, surplusDistance } }) => ({ carPosition, securityDetail, surplus, surplusDistance }))
class RouteTravel extends Component {
  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState(state => ({ percentage: state.percentage + 5 }));
  //   }, 1000);
  // }
  render() {
    const { securityDetail, carPosition, surplus, surplusDistance, dispatch } = this.props;
    if (!securityDetail) {
      return <div />;
    }
    const lineData = securityDetail.routes;
    let percentage = 0;
    if (carPosition && Math.abs(carPosition.totalDis - carPosition.carDistance) > 100) {
      percentage = carPosition.carDistance / carPosition.totalDis * 100;
    }
    if (securityDetail.routeStatus === 3 || securityDetail.routeStatus === 100) {
      percentage = 100;
    }
    const allRoutePoints = getAllRoutePoints(lineData);
    const crossingPoints = lineData.routeJson && lineData.routeJson.routes && lineData.routeJson.routes.length && lineData.routeJson.routes[0].steps;
    const allCrossingPoints = getCrossPointPercentage(crossingPoints, lineData.totalDistance);

    const arriveTime = (pointDistance, carDistance) => {
      if (!pointDistance || !carDistance || !parseInt(surplusDistance)) return 0;
      const speed = carPosition.carSpeed || 50;
      let val = (pointDistance - carDistance / 1000) / speed * 60;
      val = val <= 0 ? 0 : val;
      return !isNaN(val) && val.toFixed(1);
    }
    const totalDistance = lineData.totalDistance;
    const lastPointFromStartDis = lineData.routePoints[lineData.routePoints.length - 1] && lineData.routePoints[lineData.routePoints.length - 1].pointDistanceFromStart;

    const getHornValue = () => {
      let str = "车队即将出发，请准备...";
      if (securityDetail && securityDetail.routeStatus > 1 && carPosition && carPosition.carDistance) {
        const carDisPercent = carPosition.carDistance / 1000 / totalDistance * 100;
        const cur = allRoutePoints.find(d => carDisPercent < d.percent);
        str = `车队即将进入：${cur ? cur.name : ''}`
      }
      if (securityDetail && securityDetail.routeStatus === 100){
        return '任务已结束';
      }
      return str
    }
    return (
      <div className={styles.routeTravelContainer}>
        <div className={styles.header}>
          <span>
            <span style={{ marginRight: 20 }}>前导指挥员: {securityDetail.commander || '-'}/{securityDetail.phonenumber || '-'}</span>
            <span>车牌号: {securityDetail.firstCarNo || '-'}</span>
            {securityDetail && (securityDetail.routeStatus === 0 || securityDetail.routeStatus === 1) && (<span onClick={() => {
              dispatch({
                type: 'fight/save',
                payload: {
                  confirmLicensePlateModalVisible: true,
                },
              });
            }} className={styles.showCarModal}>
              {securityDetail.hasCommanderCarInfo ? '修改前导车配置' : '配置前导车'}
              <img className={styles.arrow_link} src={arrowLinkImg} alt=""/>
            </span>)}
          </span>
          {/* <span className={styles.right}>
            <img src={hornImg} alt='' style={{ marginRight: 10 }}/>
            {getHornValue()}
          </span> */}
        </div>
        <div className={styles.body}>
          {allRoutePoints.map((obj, index) => (
            <Jurisdiction
              key={index}
              index={index}
              name={obj.name}
              length={allRoutePoints.length}
              position={[
                allRoutePoints[index - 1] ? allRoutePoints[index - 1].percent : 0,
                obj.percent,
              ]}
            />
          ))}
          <div className={styles.progress}>
            {/* 车 */}
            {
              securityDetail.routeStatus !== 0 && securityDetail.routeStatus !== 100 &&
              <CarInfo percentage={percentage} carSpeed={
                securityDetail.routeStatus < 3 ? (carPosition && carPosition.carSpeed) : 0
                } />}
            {/* 红线 */}
            <div className={styles.progressInner} style={{ width: `${percentage}%` }}></div>
            {/* 起点 */}
            <PointInfo name={lineData.start} percentage={0} />
            {/* 路口 */}
            {
              // allCrossingPoints.map((d, key) => {
              //   return (
              //     <div key={key}>
              //       <CrossPoint name={d.name} percentage={d.percent} surplusArriveTime={arriveTime(d.percent * lineData.totalDistance / 100, carPosition && carPosition.carDistance)} />
              //     </div>
              //   )
              // })
            }
            {/* 途径点 */}
            {lineData.routePoints.map((value, key) => {
              let position = [];
              if (key === 0) {
                position = [0, (value.pointDistance / totalDistance) * 100];
              }
              if (key > 0) {
                position = [(lineData.routePoints[key - 1].pointDistance / totalDistance) * 100, (value.pointDistance / totalDistance) * 100]
              }
              return (
                <div key={value.id}>
                  <LineInfo position={position} value={value} />
                  <PointInfo
                    key={value.id}
                    surplusArriveTime={arriveTime(value.pointDistanceFromStart, carPosition && carPosition.carDistance)}
                    name={value ? value.name : ''}
                    percentage={(value.pointDistanceFromStart / totalDistance) * 100}
                  />
                </div>)
            })}
            {/* 最后一个途径点与终点的连线 */}
            <LineInfo position={[
              (lastPointFromStartDis / totalDistance) * 100,
              100 - (lastPointFromStartDis / totalDistance) * 100
            ]} value={{pointDistance: totalDistance - lastPointFromStartDis}} />
            {/* 终点 */}
            <PointInfo
              surplusArriveTime={securityDetail.routeStatus < 3 ? (surplus / 1000 / 60).toFixed() : 0}
              name={lineData.end}
              percentage={100}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default RouteTravel;
const getAllRoutePoints = routes => {
  const list = [];
  const { startJurisdiction = '', endJurisdiction = '', totalDistance } = routes;
  const routePoints = routes.routePoints || [];
  routePoints &&
    routePoints.forEach((obj, index) => {
      if (index === 0) {
        if (startJurisdiction === obj.jurisdiction) {
          list.push({
            name: startJurisdiction,
            percent:
              ((obj.pointDistance +
                (routePoints[index + 1]
                  ? routePoints[index + 1].pointDistance
                  : totalDistance - obj.pointDistance) /
                2) *
                100) /
              totalDistance,
          });
        } else {
          list.push(
            { name: startJurisdiction, percent: obj.pointDistance / 2 },
            {
              name: obj.jurisdiction,
              percent:
                ((obj.pointDistance +
                  (routePoints[index + 1]
                    ? routePoints[index + 1].pointDistance
                    : totalDistance - obj.pointDistance) /
                  2) *
                  100) /
                totalDistance,
            },
          );
        }
      } else {
        if (list[list.length - 1] && obj.jurisdiction === list[list.length - 1].name) {
          list[list.length - 1].percent =
            ((obj.pointDistance +
              ((routePoints[index + 1] ? routePoints[index + 1].pointDistance : totalDistance) -
                obj.pointDistance) /
              2) *
              100) /
            totalDistance;
        } else {
          list.push({
            name: obj.jurisdiction,
            percent:
              ((obj.pointDistance +
                (routePoints[index + 1]
                  ? routePoints[index + 1].pointDistance
                  : totalDistance - obj.pointDistance) /
                2) *
                100) /
              totalDistance,
          });
        }
      }
    });
  if (list[list.length - 1]) {
    endJurisdiction === list[list.length - 1].name
      ? (list[list.length - 1].percent = 100)
      : list.push({ name: endJurisdiction, percent: 100 });
  }
  return list;
};

const getCrossPointPercentage = (points, totalDis) => {
  // console.log(totalDis)
  let newPoints = [];
  let currentPoint2StartDistance = 0;
  if (Array.isArray(points) && points.length) {
    points.map((d) => {
      currentPoint2StartDistance += +d.distance;
      newPoints.push({
        name: d.instruction,
        percent: currentPoint2StartDistance / 1000 / totalDis * 100
      })
    })
  }
  return newPoints;
}
