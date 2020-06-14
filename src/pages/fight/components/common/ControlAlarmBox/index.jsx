import React, { Component } from 'react';
import { Button, message } from 'antd';
import test from '@/assets/img/zard.jpeg';
import styles from './index.scss';

class ControlAlarmBox extends Component {

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
      <span className={styles.left}>人脸布控报警</span>
      <span className={styles.right}>
        <span className={styles.similarity}>相似度: {alarmSingle.similarity * 100}%</span>
        <Button onClick={this.unableClick}>忽略任务</Button>
        <Button onClick={this.unableClick}>现场已处置</Button>
      </span>


      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.title}>抓拍信息</div>
          <div className={styles.imgAndText}>
            <img src={test} alt="" />
            <div className={styles.texts}>
              <p>抓拍时间: {alarmSingle.caseTime}</p>
              <p>发现地点: {alarmSingle.addr}</p>
              <p>所属派出所: 西湖转塘派出所</p>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>布控目标信息</div>
          <div className={styles.imgAndText}>
            <img src={test} alt="" />
            <div className={styles.texts}>
              <p className={styles.textAndButton}>
                <span>姓名: {alarmSingle.targetName}</span>
                <Button type="primary" size="small">
                  一人一档
                </Button>
              </p>
              <p>
                身份证: <span className={styles.blue}>{alarmSingle.targetId}</span>
              </p>
              <p>布控库: {alarmSingle.targetSource}</p>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default ControlAlarmBox;
