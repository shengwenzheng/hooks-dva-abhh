import React, { Component } from 'react';
import { Modal, Steps } from 'antd';
import BasicDeploy from '../BasicDeploy';
import StartEndPointDeploy from '../StartEndPointDeploy';
import RouteDeploy from '../RouteDeploy';
import RoutePreview from '../RoutePreview';
import ResourceDeploy from '../ResourceDeploy';
import { stepList } from '@/utils/config';
import { connect } from 'dva';
import styles from './index.scss';

const { Step } = Steps;

@connect(({ routeGuard: { modalVisible, stepCurrent, id, disabled } }) => ({
  modalVisible,
  stepCurrent,
  id,
  disabled,
}))
class NewTask extends Component {
  handleModalCancel = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/save', payload: { modalVisible: false } });
    dispatch({ type: 'routeGuard/resetAddTaskForm' });
  };

  onStepChange = stepCurrent => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/save', payload: { stepCurrent } });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/resetAddTaskForm' });
  };

  render() {
    const { modalVisible, stepCurrent, id, disabled } = this.props;
    return (
      <Modal
        visible={modalVisible}
        onCancel={this.handleModalCancel}
        maskClosable={false}
        destroyOnClose
        footer={null}
        centered={true}
        width={1020}
        bodyStyle={{ height: 680, padding: 40 }}
      >
        <div className={styles.body}>
          <Steps
            current={stepCurrent}
            onChange={id > 0 || disabled ? this.onStepChange : undefined}
          >
            {stepList.map(v => (
              <Step key={v} title={v} />
            ))}
          </Steps>
          <BasicDeploy
            style={stepCurrent === 0 ? null : { display: 'none' }}
            onCancel={this.cancel}
          />
          <StartEndPointDeploy
            style={stepCurrent === 1 ? null : { display: 'none' }}
            onCancel={this.cancel}
          />
          <RouteDeploy
            style={stepCurrent === 2 ? null : { display: 'none' }}
            onCancel={this.cancel}
          />
          <RoutePreview
            style={stepCurrent === 3 ? null : { display: 'none' }}
            onCancel={this.cancel}
          />
          <ResourceDeploy
            style={stepCurrent === 4 ? null : { display: 'none' }}
            onCancel={this.cancel}
          />
        </div>
      </Modal>
    );
  }
}

export default NewTask;
