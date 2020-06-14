import React, { Component } from 'react';
import { Button, Select } from 'antd';
import { stepList } from '@/utils/config';
import { connect } from 'dva';
import { message } from 'antd';
import startPointImg from '@/assets/img/startPoint.png';
import endPointImg from '@/assets/img/endPoint.png';
import Map from '../Map';
import styles from './index.scss';

const { Option } = Select;

@connect(({ routeGuard: { routes, addressList, stepCurrent, disabled, id } }) => ({
  routes,
  addressList,
  stepCurrent,
  disabled,
  id,
}))
class StartEndPointDeploy extends Component {
  goStep = index => {
    const { dispatch, routes } = this.props;
    const { start = '', end = '' } = routes[0] || {};
    if (index === 2 && (!start || !end)) {
      message.error('请输入起点或终点');
      return;
    }
    dispatch({ type: 'routeGuard/save', payload: { stepCurrent: index } });
  };

  save = () => {
    const { dispatch, routes } = this.props;
    const { start = '', end = '' } = routes[0] || {};
    if (!start || !end) {
      message.error('请输入起点或终点');
      return;
    }
    dispatch({ type: 'routeGuard/completeDeploy' });
  };

  onSearchInputChange = (value, name) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeGuard/saveStartEndPoint',
      payload: { key: name, value },
    });
  };

  searchList = value => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/throttleGetAddressList', payload: { q: value } });
  };

  render() {
    const { style, routes, addressList, stepCurrent, disabled, id, onCancel } = this.props;
    const { start = '', end = '' } = routes[0] || {};
    return (
      <div style={style} className={styles.startEndPointDeployContainer}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.line}>
              <span>起点</span>
              <Select
                placeholder="请选择起点"
                showSearch
                value={start}
                filterOption={false}
                showArrow={false}
                onSearch={this.searchList}
                onChange={value => this.onSearchInputChange(value, 'start')}
                notFoundContent={null}
                disabled={disabled}
              >
                {addressList.map(obj => (
                  <Option key={obj.uid} value={JSON.stringify(obj)}>
                    {obj.name}
                  </Option>
                ))}
              </Select>
              <img className={styles.icon} src={startPointImg} alt="起点" />
            </div>
            <div className={styles.line}>
              <span>终点</span>
              <Select
                placeholder="请选择终点"
                showSearch
                value={end}
                filterOption={false}
                showArrow={false}
                onSearch={this.searchList}
                onChange={value => this.onSearchInputChange(value, 'end')}
                notFoundContent={null}
                disabled={disabled}
              >
                {addressList.map(obj => (
                  <Option key={obj.uid} value={JSON.stringify(obj)}>
                    {obj.name}
                  </Option>
                ))}
              </Select>
              <img className={styles.icon} src={endPointImg} alt="终点" />
            </div>
          </div>
          <div className={styles.right}>{stepCurrent === 1 ? <Map /> : null}</div>
        </div>
        <div className={styles.footer}>
          {(id === 0 || disabled) && (
            <>
              <Button type="primary" shape="round" size="large" onClick={this.goStep.bind(this, 0)}>
                上一步 : {stepList[0]}
              </Button>
              <Button type="primary" shape="round" size="large" onClick={this.goStep.bind(this, 2)}>
                下一步 : {stepList[2]}
              </Button>
            </>
          )}
          {id > 0 && !disabled && (
            <>
              <Button className={styles.button} shape="round" size="large" onClick={onCancel}>
                取消
              </Button>
              <Button
                className={styles.button}
                type="primary"
                shape="round"
                size="large"
                onClick={this.save}
              >
                保存
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default StartEndPointDeploy;
