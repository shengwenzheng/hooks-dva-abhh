import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './index.scss';

export class Jurisdiction extends Component {
  render() {
    const {
      name,
      index,
      length,
      position: [left, right],
    } = this.props;
    return (
      <div
        className={classnames(
          styles.jurisdictionContainer,
          index % 2 ? styles.color1 : styles.color0,
          index === 0 ? styles.marginleft : null,
          length - 1 === index ? styles.marginright : null,
        )}
        style={{ left: `${left}%`, right: `${100 - right}%` }}
      >
        <span className={styles.name}>{name}</span>
      </div>
    );
  }
}

export default Jurisdiction;
