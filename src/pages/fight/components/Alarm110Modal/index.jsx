import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'dva';
import Alarm110Box from '../common/Alarm110Box';
import test from '@/assets/img/zard.jpeg';
import styles from './index.scss';

@connect(({ fight: { alarm110ModalVisible,alarmSingle } }) => ({ alarm110ModalVisible,alarmSingle }))
class Alarm110Modal extends Component {
  handleModalCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fight/save',
      payload: {
        alarm110ModalVisible: false,
      },
    });
  };

  render() {
    const { alarm110ModalVisible,alarmSingle } = this.props;
    return (
      <Modal
        visible={alarm110ModalVisible}
        onCancel={this.handleModalCancel}
        title="110告警"
        footer={null}
        centered={true}
        width={700}
        bodyStyle={{ padding: 14 }}
      >
       <Alarm110Box alarmSingle={alarmSingle} single={true}/>
      </Modal>
    );
  }
}

export default Alarm110Modal;
