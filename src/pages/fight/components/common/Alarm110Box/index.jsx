import React, { Component } from 'react';
import styles from './index.scss';
import {Button, message} from 'antd';

class Alarm110Box extends Component {
  unableClick() {
    message.warn('功能待开发')
  }
  render() {
    const { alarmSingle } = this.props;
    if(!alarmSingle){
      return <div/>
    }
    return (
      <>
      <div className={styles.header}>
        <span className={styles.left}>110报警</span>
        <span className={styles.right}>
          <Button onClick={this.unableClick}>忽略任务</Button>
          <Button onClick={this.unableClick}>现场已处置</Button>
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.title}>基础信息</div>
          <div className={styles.imgAndText}>
            <div className={styles.texts}>
              <p>报警人员: {alarmSingle.reportName || '匿名'}/{alarmSingle.reportPhone}</p>
              <p>报警地址: {alarmSingle.addr}</p>
              <p>报警时间: {alarmSingle.caseTime}</p>
              <p>接受警员: {alarmSingle.receivePoliceName}</p>
              <p>接受单位: {alarmSingle.dealOrgName}</p>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>报警内容</div>
          <div className={styles.alarmContent}>
            {alarmSingle.message}
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default Alarm110Box;
