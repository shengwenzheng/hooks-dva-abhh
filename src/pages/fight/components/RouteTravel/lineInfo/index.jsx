import React, { Component } from 'react';
import { Popover } from 'antd';
import styles from './index.scss';

class LineInfo extends Component {
  render() {
    const {
      position: [left, width],
      value
    } = this.props;
    // console.log(this.props.position)
    const popoverContent = (
      <div className={styles.popoverContent}>
        <span>该段路线长度：</span>
        <span>{value.pointDistance && value.pointDistance.toFixed(1)}km</span>
      </div>
    );
    return ( 
      <Popover content={popoverContent}>
        <div className={styles.lineInfo} style={{ left: `${left}%`, width: `${width}%` }}></div>
      </Popover>
    );
  }
}

export default LineInfo;
