import React, { Component, PureComponent } from 'react';
import NameValue from './NameValue';
import styles from './index.scss';
import { connect } from 'dva';
import { taskLevelList } from '@/utils/config';
@connect(
  ({
    fight: {
      securityDetail,
      alermList,
      taskCount,
      keepTime,
      surplusTime,
      surplusDistance,
      policeCount,
    },
  }) => ({
    securityDetail,
    alermList,
    taskCount,
    keepTime,
    surplusTime,
    surplusDistance,
    policeCount,
  }),
)
class Header extends PureComponent {
  render() {
    const {
      securityDetail,
      alermList,
      taskCount,
      keepTime,
      surplusTime,
      surplusDistance,
      policeCount,
    } = this.props;
    const totalDistance = (securityDetail && securityDetail.routes && securityDetail.routes.totalDistance || 0).toFixed(1);
    let alarmCount = '--';
    let level = '';
    if (securityDetail && securityDetail.state === 1) {
      alarmCount = alermList.length;
    }
    if (securityDetail) {
      const rst = taskLevelList.filter(value => value.value === securityDetail.level);
      if (rst.length > 0) {
        level = rst[0].name;
      }
    }
    return (
      <div className={styles.headerContainer}>
        <NameValue name="警卫等级" value={level} />
        <NameValue name="总里程" value={totalDistance} unit="km" />
        <NameValue name="剩余里程" value={surplusDistance} unit="km" />
        <NameValue name="车队已行驶时长" value={keepTime} />
        <NameValue name="剩余到达时长" value={surplusTime} />
        <NameValue name="警力" value={policeCount} unit="人" />
        <NameValue name="预警数" value={alarmCount} unit="条" />
        <NameValue name="当前任务总数" value={taskCount} />
      </div>
    );
  }
}

export default Header;
