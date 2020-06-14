import React, { Component } from 'react';
import { Popover,Tooltip  } from 'antd';
import classnames from 'classnames';
import styles from './index.scss';

const formatName = name => {
  if (name && name.length > 8) {
    return `${name.slice(0, 7)}...`;
  }
  return name;
};

const startPoint = <div className={styles.startPoint}>起</div>;

class CrossPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  
  popoverContent = () => {
    const times = (this.props.surplusArriveTime + '').split('.');
    return (<div className={styles.popoverContent}>
      <span>{times[0]}分{times[1] && `${times[1] * 6}秒`}后</span>
      <span>到达此点</span>
    </div>
    )
  }
  endPoint = () => (
    <Popover content={this.popoverContent()}>
      <div className={styles.endPoint}>终</div>
    </Popover>
  )

  normalPoint = () => (
    <Popover content={this.popoverContent()}>
      <div className={classnames(styles.point, styles.normal)}></div>
    </Popover>
  );
  
  getPoint = () => {
    const { percentage } = this.props;
    if (percentage === 0) {
      return startPoint;
    } else if (percentage === 100) {
      return this.endPoint();
    }
    return this.normalPoint();
  };

  render() { 
    const { name, percentage } = this.props;
    return (
      <div className={styles.crossPoint} style={{ left: `${percentage}%` }}>
        {this.getPoint()}
        <div className={styles.info}>
          <Tooltip  title={name}>
            {/* {formatName(name)} */}
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default CrossPoint;
