import React, { Component } from 'react';
import styles from './index.scss';

class Box extends Component {
  render() {
    const { style, children } = this.props;
    return (
      <div className={styles.boxContainer} style={style}>
        <div className={styles.content}>{children}</div>
        <i className={styles.leftTop} />
        <i className={styles.rightTop} />
        <i className={styles.leftBottom} />
        <i className={styles.rightBottom} />
      </div>
    );
  }
}

export default Box;
