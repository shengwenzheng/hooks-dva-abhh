import React, { Component } from 'react';
import { Button, Icon, message, Select, Radio } from 'antd';
import { stepList } from '@/utils/config';
import { connect } from 'dva';
import startPointImg from '@/assets/img/startPoint.png';
import endPointImg from '@/assets/img/endPoint.png';
import Map from '../Map';
import styles from './index.scss';

const { Option } = Select;

@connect(
  ({ routeGuard: { routes, addressList, stepCurrent, disabled, radioGroup, radioValue, id } }) => ({
    routes,
    addressList,
    stepCurrent,
    disabled,
    radioGroup,
    radioValue,
    id,
  }),
)
class RouteDeploy extends Component {
  goStep = index => {
    const { dispatch, routes } = this.props;
    for (let route of routes) {
      const { routePoints = [] } = route || {};
      for (let obj of routePoints) {
        if (!obj.name) {
          message.error('请输入途经点');
          return;
        }
      }
    }
    dispatch({ type: 'routeGuard/save', payload: { stepCurrent: index } });
  };

  save = () => {
    const { dispatch, routes } = this.props;
    for (let route of routes) {
      const { routePoints = [] } = route || {};
      for (let obj of routePoints) {
        if (!obj.name) {
          message.error('请输入途经点');
          return;
        }
      }
    }
    dispatch({ type: 'routeGuard/completeDeploy' });
  };

  insertRoutePoints = (routePoints, index) => {
    const { dispatch, disabled } = this.props;
    if (disabled) return;
    dispatch({ type: 'routeGuard/insertRoutePoints', payload: { routePoints, index } });
  };

  deleteRoutePoints = (routePoints, index) => {
    const { dispatch, disabled } = this.props;
    if (disabled) return;
    dispatch({ type: 'routeGuard/deleteRoutePoints', payload: { routePoints, index } });
  };

  onSearchInputChange = (routePoints, value, index) => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/saveRoutePointName', payload: { routePoints, value, index } });
  };

  searchList = value => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/throttleGetAddressList', payload: { q: value } });
  };

  onRadioChange = e => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/save', payload: { radioValue: e.target.value } });
  };

  addRoute = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/addRoute' });
  };

  removeRoute = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/removeRoute' });
  };

  render() {
    const {
      style,
      routes,
      addressList,
      stepCurrent,
      disabled,
      radioGroup,
      radioValue,
      id,
      onCancel,
    } = this.props;
    const { start = '', end = '', routePoints = [] } = routes[radioValue] || {};
    return (
      <div style={style} className={styles.routeDeployContainer}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.radioContainer}>
              <Radio.Group value={radioValue} onChange={this.onRadioChange}>
                {radioGroup.map(({ name, value }) => (
                  <Radio.Button key={value} value={value}>
                    {name}
                  </Radio.Button>
                ))}
              </Radio.Group>
              {!disabled && (
                <>
                  <Icon
                    type="plus-circle"
                    onClick={this.addRoute}
                    style={radioGroup.length > 2 ? { display: 'none' } : null}
                  />
                  <Icon
                    type="minus-circle"
                    onClick={this.removeRoute}
                    style={radioGroup.length < 2 ? { display: 'none' } : null}
                  />
                </>
              )}
            </div>
            <div className={styles.line}>
              <span>起点</span>
              <span>{start}</span>
              <img className={styles.icon} src={startPointImg} alt="起点" />
              <Icon
                className={styles.plus}
                type="plus-circle"
                theme="twoTone"
                twoToneColor="#b1b1b1"
                onClick={this.insertRoutePoints.bind(this, routePoints, 0)}
              />
            </div>
            {routePoints.map((obj, index) => (
              <div key={index} className={styles.line}>
                <span>
                  <i className={styles.circle} />
                </span>
                <Select
                  placeholder="请选择途经点"
                  showSearch
                  value={obj.name}
                  filterOption={false}
                  showArrow={false}
                  onSearch={this.searchList}
                  onChange={value => this.onSearchInputChange(routePoints, value, index)}
                  notFoundContent={null}
                  disabled={disabled}
                >
                  {addressList.map(obj => (
                    <Option key={obj.uid} value={JSON.stringify(obj)}>
                      {obj.name}
                    </Option>
                  ))}
                </Select>
                <Icon
                  className={styles.minus}
                  type="minus-circle"
                  theme="twoTone"
                  twoToneColor="#b1b1b1"
                  onClick={this.deleteRoutePoints.bind(this, routePoints, index)}
                />
                <Icon
                  className={styles.plus}
                  type="plus-circle"
                  theme="twoTone"
                  twoToneColor="#b1b1b1"
                  onClick={this.insertRoutePoints.bind(this, routePoints, index + 1)}
                />
              </div>
            ))}
            <div className={styles.line}>
              <span>终点</span>
              <span>{end}</span>
              <img className={styles.icon} src={endPointImg} alt="终点" />
            </div>
          </div>
          <div className={styles.right}>{stepCurrent === 2 ? <Map /> : null}</div>
        </div>
        <div className={styles.footer}>
          {(id === 0 || disabled) && (
            <>
              <Button type="primary" shape="round" size="large" onClick={this.goStep.bind(this, 1)}>
                上一步 : {stepList[1]}
              </Button>
              <Button type="primary" shape="round" size="large" onClick={this.goStep.bind(this, 3)}>
                下一步 : {stepList[3]}
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

export default RouteDeploy;
