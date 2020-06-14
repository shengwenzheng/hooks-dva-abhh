import React, { Component } from 'react';
import { Icon } from 'antd';
import goStraightImg from '@/assets/img/goStraight.png';
import turnLeftImg from '@/assets/img/turnLeft.png';
import turnRightImg from '@/assets/img/turnRight.png';
import styles from './RoutePoint.scss';

const getImg = direction => {
  if (direction === 'left') return turnLeftImg;
  else if (direction === 'right') return turnRightImg;
  else return goStraightImg;
};

class RoutePoint extends Component {
  render() {
    const { name } = this.props.data;
    return (
      <div className={styles.routePointContainer}>
        <p>
          {/* <img src={getImg(direction)} alt="." /> */}
          <span>{name}</span>
          <Icon type="up" style={{ cursor: 'pointer', transition: '0.5s' }} />
        </p>
        {/* <p>{distance || '未知'}</p> */}
      </div>
    );
  }
}

export default RoutePoint;
