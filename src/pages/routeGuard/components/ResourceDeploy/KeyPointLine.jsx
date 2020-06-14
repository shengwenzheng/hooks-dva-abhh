import React, { Component } from 'react';
import { Input, Icon } from 'antd';
import keyPointImg from '@/assets/img/keyPoint.png';
import styles from './KeyPointLine.scss';

class KeyPointLine extends Component {
  onPlusClick = () => {
    const { onPlusClick, disabled } = this.props;
    if (disabled) return;
    onPlusClick();
  };

  onMinusClick = () => {
    const { onMinusClick, disabled } = this.props;
    if (disabled) return;
    onMinusClick();
  };

  render() {
    const { showMinus, onLongitudeChange, onLatitudeChange, disabled, data = {} } = this.props;
    const { longitude, latitude } = data;
    return (
      <div className={styles.keyPointLine}>
        <span>制高点</span>
        <Input
          placeholder="经度"
          value={longitude}
          onChange={e => onLongitudeChange(e)}
          disabled={disabled}
        />
        <Input
          placeholder="纬度"
          value={latitude}
          onChange={e => onLatitudeChange(e)}
          disabled={disabled}
        />
        <div className={styles.imgBox}>
          <img src={keyPointImg} alt="." />
        </div>
        <Icon
          className={styles.plus}
          type="plus-circle"
          theme="twoTone"
          twoToneColor="#b1b1b1"
          onClick={this.onPlusClick}
        />
        <Icon
          style={showMinus ? null : { display: 'none' }}
          className={styles.minus}
          type="minus-circle"
          theme="twoTone"
          twoToneColor="#b1b1b1"
          onClick={this.onMinusClick}
        />
      </div>
    );
  }
}

export default KeyPointLine;
