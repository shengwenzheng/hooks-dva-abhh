import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'dva';
import ControlAlarmBox from '../common/ControlAlarmBox';
import test from '@/assets/img/zard.jpeg';
import control from '@/assets/img/control.png';
import styles from './index.scss';

@connect(({ fight: { controlAlarmModalVisible,alarmSingle } }) => ({ controlAlarmModalVisible,alarmSingle }))
class ControlAlarmModal extends Component {
  handleModalCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fight/save',
      payload: {
        controlAlarmModalVisible: false,
      },
    });
  };

  render() {
    const { controlAlarmModalVisible,alarmSingle } = this.props;
    return (
      <Modal
        visible={controlAlarmModalVisible}
        onCancel={this.handleModalCancel}
        title="布控告警"
        footer={null}
        centered={true}
        width={700}
        bodyStyle={{ padding: 14 }}
      >
        <ControlAlarmBox alarmSingle={alarmSingle} single={true}/>
      </Modal>
    );
  }
}

export default ControlAlarmModal;
