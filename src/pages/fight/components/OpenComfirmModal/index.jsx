import React, { Component,createRef } from 'react';
import { Modal, Button, Select,Input  } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import styles from './index.scss';

@connect(({ fight: { openComfirmModalVisible } }) => ({
  openComfirmModalVisible,
}))
class OpenComfirmModal extends Component {
  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fight/save',
      payload: {
        openComfirmModalVisible: false,
      },
    });
    dispatch({
      type: 'fight/save',
      payload: {
        confirmLicensePlateModalVisible: true,
      },
    });
  };
  handleModalCancel= () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fight/save',
      payload: {
        openComfirmModalVisible: false,
      },
    });
  };

  render() {
    const { openComfirmModalVisible } = this.props;

    return (
      <Modal
        visible={openComfirmModalVisible}
        onOk={this.putCarCommand}
        maskClosable={false}
        footer={null}
        centered={true}
        width={510}
        destroyOnClose={true}
        bodyStyle={{ padding: 22 }}
      >
        <div className={styles.title}>未配置前导车，无法追踪车队行进，请先配置前导车</div>
        <div className={styles.content}>若取消本次操作，将原路返回“任务已开始”界面。不配置前导车，任务将无法进行下去。</div>
        <div className={styles.footer}>
          <Button className={styles.button} type="primary" onClick={this.showModal}>
            立即配置前导车
          </Button>
          <Button className={styles.button} onClick={this.handleModalCancel}>
            取消
          </Button>
        </div>
      </Modal>
    );
  }
}

export default OpenComfirmModal;
