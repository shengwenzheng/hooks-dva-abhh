import React, { Component } from 'react';
import { Tabs } from 'antd';
import TaskManage from './components/TaskManage';
import styles from './index.scss';

const { TabPane } = Tabs;

class RouteGuard extends Component {
  onTabsChange = () => {};

  render() {
    return (
      <div className={styles.routeGuardContainer}>
        <Tabs onChange={this.onTabsChange} type="card">
          <TabPane tab="任务管理" key="1">
            <TaskManage />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default RouteGuard;
