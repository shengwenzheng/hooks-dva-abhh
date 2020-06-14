import React, { Component } from 'react';
import { Modal, Tabs } from 'antd';
import Alarm110Box from '../common/Alarm110Box';
import ControlAlarmBox from '../common/ControlAlarmBox';
import { connect } from 'dva';
import styles from './index.scss';

const { TabPane } = Tabs;

@connect(({ fight: { alarmAllModalVisible,alermList } }) => ({ alarmAllModalVisible,alermList }))
class Alarm110Modal extends Component {
  handleModalCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fight/save',
      payload: {
        alarmAllModalVisible: false,
      },
    });
  };

  render() {
    const { alarmAllModalVisible,alermList } = this.props;
    if(alermList.length === 0){
      return <div/>
    }
    const hasHandle = alermList.filter(value => value.caseState >= 4);
    const handle = alermList.filter(value => value.caseState < 4)
    return (
      <Modal
        visible={alarmAllModalVisible}
        onCancel={this.handleModalCancel}
        footer={null}
        centered={true}
        width={700}
        bodyStyle={{ padding: 14 }}
      >
        <div className={styles.alarmAll}>
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane tab={<div className={styles.alarmType}>全部告警({alermList.length})</div>} key="1">
              {
                alermList.map(value => {
                  if(value.type === 1){
                    return <Alarm110Box alarmSingle={value} key={value.id}/>
                  }else{
                    return <ControlAlarmBox alarmSingle={value} key={value.id}/>
                  }
                })
              }
            </TabPane>
            <TabPane tab={<div className={styles.alarmType}>已处置({hasHandle.length})</div>} key="2">
              {
                hasHandle.map(value => {
                  if(value.type === 1){
                    return <Alarm110Box alarmSingle={value} key={value.id}/>
                  }else{
                    return <ControlAlarmBox alarmSingle={value} key={value.id}/>
                  }
                })
              }
            </TabPane>
            <TabPane tab={<div className={styles.alarmType}>未处置({handle.length})</div>} key="3">
              {
                handle.map(value => {
                  if(value.type === 1){
                    return <Alarm110Box alarmSingle={value} key={value.id}/>
                  }else{
                    return <ControlAlarmBox alarmSingle={value} key={value.id}/>
                  }
                })
              }
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}

export default Alarm110Modal;
