import React, { Component } from 'react';
import carImg from '@/assets/img/car.png';
import styles from './index.scss';

class CarInfo extends Component {
  render() {
    const { percentage, carSpeed } = this.props;
    return (
      <div className={styles.carInfo} style={{ left: `${percentage}%` }}>
        <div className={styles.info}>
          <span className={styles.number}>{isFinite(carSpeed) ? Number(carSpeed).toFixed() : 0}</span>
          <span className={styles.unit}>km/h</span>
        </div>
        <img src={carImg} alt="" className={styles.car} />
      </div>
    );
  }
}

export default CarInfo;
