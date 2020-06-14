import React, { Component } from 'react';
import styles from './NameValue.scss';

class NameValue extends Component {
  render() {
    const { name, value, unit } = this.props;
    return (
      <div className={styles.nameValueContainer}>
        <span className={styles.name}>{name}</span>
        <span className={styles.value}>{value}</span>
        <span className={styles.unit}>{unit}</span>
      </div>
    );
  }
}

export default NameValue;
