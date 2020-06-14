import React, { Component,PureComponent } from 'react';
import ControlAlarmModal from '../ControlAlarmModal';
import Alarm110Modal from '../Alarm110Modal';
import AlarmAllModal from '../AlarmAllModal';
import ConfirmLicensePlateModal from '../ConfirmLicensePlateModal';
import OpenComfirmModal from '../OpenComfirmModal';
import { connect } from 'dva';
import styles from './index.scss';

@connect(({ fight: { alermList } }) => ({ alermList }))
class RealtimeAlert extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handleClick = (type,id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fight/saveAlarmSingle',
      payload: {
        alarm110ModalVisible: type === 1,
        controlAlarmModalVisible: type === 2,
        id,
      },
    });
  };

  allAlarmClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fight/save',
      payload: {
        alarmAllModalVisible: true
      },
    });
  }

  render() {
    const { alermList } = this.props;
    return (
      <div className={styles.realtimeAlertContainer}>
        <div className={styles.header} onClick={this.allAlarmClick}>
          <span>全部告警<br/>{alermList.length}</span>
          <span><i style={{background:'#1dcb2a'}}></i>已处置<br/>{alermList.filter(value => value.caseState >= 4).length}</span>
          <span><i style={{background:'#e22121'}}></i>未处置<br/>{alermList.filter(value => value.caseState < 4).length}</span>
        </div>
        <div className={styles.content}>
          {alermList ? (
            <ul>
              {alermList.map(v => (
                <li key={v.id} onClick={() => this.handleClick(v.type, v.id)} className={v.caseState < 4 ? styles.blinkLi : null}>
                  {v.message}
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <span>当前暂无报警信息!</span>
            </div>
          )}
        </div>
        <ConfirmLicensePlateModal />
        <OpenComfirmModal />
        <ControlAlarmModal />
        <Alarm110Modal />
        <AlarmAllModal />
      </div>
    );
  }
}

export default RealtimeAlert;
