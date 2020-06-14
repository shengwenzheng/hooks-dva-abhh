import React, { Component } from 'react';
import styles from './Route.scss';
import img from '@/assets/img/route.png';

const statusToValue = {
  0: { statusName: '未执行', backgroundColor: '#17CE27' },
  1: { statusName: '执行中', backgroundColor: '#F10000' },
  2: { statusName: '已完成', backgroundColor: '#C5C5C5' },
};

class Folder extends Component {
  render() {
    const { name, status, click, onClick } = this.props;
    const { statusName, backgroundColor } = statusToValue[status] || statusToValue.no;
    return (
      <div
        className={styles.folderContainer}
        style={click ? { backgroundColor: '#fff', borderColor: '#2950B8' } : null}
        onClick={onClick}
      >
        <div className={styles.status} style={click ? { backgroundColor: '#2950B8' } : null} />
        <img src={img} alt="" />
        <span className={styles.name}>{name}</span>
        <span className={styles.right}>
          <i className={styles.circlePoint} style={{ backgroundColor }} />
          <span>{statusName}</span>
        </span>
      </div>
    );
  }
}

export default Folder;
