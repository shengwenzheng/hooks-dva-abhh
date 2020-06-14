import React, { Component } from 'react';
import { Button, Radio } from 'antd';
import { connect } from 'dva';
import { stepList } from '@/utils/config';
import RoutePoint from './RoutePoint';
import startPointImg from '@/assets/img/startPoint.png';
import endPointImg from '@/assets/img/endPoint.png';
import styles from './index.scss';
import Map from '../Map';

@connect(
  ({
    routeGuard: { routes, stepCurrent, radioValue, radioGroup, id, disabled },
    map: { carRoute },
  }) => ({
    routes,
    stepCurrent,
    radioValue,
    radioGroup,
    id,
    disabled,
    carRoute,
  }),
)
class RoutePreview extends Component {
  goStep = index => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/save', payload: { stepCurrent: index } });
  };

  save = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/completeDeploy' });
  };

  onRadioChange = e => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/save', payload: { radioValue: e.target.value } });
  };

  render() {
    const {
      style,
      routes,
      stepCurrent,
      radioValue,
      radioGroup,
      id,
      disabled,
      onCancel,
      carRoute,
    } = this.props;
    const { start = '', end = '', routePoints = [] } = routes[radioValue] || {};
    return (
      <div className={styles.routePreviewContainer} style={style}>
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
            </div>
            <p className={styles.startEnd}>
              <img src={startPointImg} alt="point" />
              <span>{start}</span>
            </p>
            {routePoints.map((obj, index) => (
              <RoutePoint key={index} data={obj} />
            ))}
            <p className={styles.startEnd}>
              <img src={endPointImg} alt="point" />
              <span>{end}</span>
            </p>
          </div>
          <div className={styles.right}>{stepCurrent === 3 ? <Map /> : null}</div>
        </div>
        <div className={styles.footer}>
          {(id === 0 || disabled) && (
            <>
              <Button type="primary" shape="round" size="large" onClick={this.goStep.bind(this, 2)}>
                上一步 : {stepList[2]}
              </Button>
              <Button type="primary" shape="round" size="large" onClick={this.goStep.bind(this, 4)}>
                下一步 : {stepList[4]}
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

export default RoutePreview;
