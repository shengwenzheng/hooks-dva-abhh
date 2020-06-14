import React, { Component } from 'react';
import { Radio, DatePicker, Button, Table, Divider, Modal } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import NewTask from '../NewTask';
import { routerGuardTaskListColumns } from '@/utils/config';
import styles from './index.scss';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

@connect(
  ({
    routeGuard: { taskList, taskListTotal, taskState, taskDate, taskStateList, page },
    loading,
  }) => ({
    taskList,
    taskListTotal,
    taskState,
    taskDate,
    taskStateList,
    page,
    loading: loading.effects['routeGuard/getTaskList'],
  }),
)
class TaskManage extends Component {
  handleModalShow = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/save', payload: { modalVisible: true } });
  };

  onRadioChange = e => {
    const { dispatch } = this.props;
    const { value } = e.target;
    dispatch({ type: 'routeGuard/filterTaskState', payload: { value } });
  };

  onDateChange = dates => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/save', payload: { taskDate: dates, page: 1 } });
    if (!dates.length) {
      dispatch({ type: 'routeGuard/getTaskList' });
    }
  };

  onDateOpenChange = status => {
    if (!status) {
      const { dispatch } = this.props;
      dispatch({ type: 'routeGuard/getTaskList' });
    }
  };

  onPageChange = page => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/save', payload: { page } });
    dispatch({ type: 'routeGuard/getTaskList', payload: { page } });
  };

  goFightPage = record => {
    const { id } = record;
    // this.props.dispatch({
    //   type: 'fight/getSecurityDetail',
    //   payload: {
    //     id,
    //   },
    // });
    router.push({
      pathname: '/fight',
      query: {
        id,
      },
    });
  };

  deleteTask = record => {
    confirm({
      title: '确定删除该项?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const { id } = record;
        const { dispatch } = this.props;
        dispatch({ type: 'routeGuard/deleteTask', payload: { id } });
      },
    });
  };

  seeDetail = record => {
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/getTaskDetail', payload: { id } });
  };

  editDetail = record => {
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/editTaskDetail', payload: { id } });
  };

  videoReplay = record => {
    Modal.info({
      content: <p>{record.recordScreenPath}</p>,
      okText: '确定',
    });
  };

  getColumn = () => {
    const { taskState } = this.props;
    const obj = { title: '操作', key: 'edit', align: 'center', width: 200 };
    if (taskState === 0) {
      obj.render = (text, record, index) => {
        return (
          <div className={styles.buttonContainer}>
            <div>
              <Button type="link" onClick={this.seeDetail.bind(this, record)}>
                查看配置
              </Button>
              <Divider type="vertical" />
              <Button type="link" onClick={this.editDetail.bind(this, record)}>
                修改配置
              </Button>
            </div>
            <div>
              <Button type="link" onClick={this.deleteTask.bind(this, record)}>
                删除任务
                <Divider type="vertical" />
              </Button>
              <Button type="link" onClick={this.goFightPage.bind(this, record)}>
                进入作战
              </Button>
            </div>
          </div>
        );
      };
    } else if (taskState === 1) {
      obj.render = (text, record, index) => {
        return (
          <div>
            <Button type="link" onClick={this.goFightPage.bind(this, record)}>
              进入作战
            </Button>
          </div>
        );
      };
    } else {
      obj.render = (text, record, index) => {
        return (
          <div className={styles.buttonContainer}>
            <div>
              <Button type="link" onClick={this.seeDetail.bind(this, record)}>
                查看配置
              </Button>
              <Divider type="vertical" />
              <Button type="link" onClick={this.deleteTask.bind(this, record)}>
                删除任务
              </Button>
            </div>
            <div>
              <Button type="link" onClick={this.videoReplay.bind(this, record)}>
                录屏回放
              </Button>
            </div>
          </div>
        );
      };
    }
    routerGuardTaskListColumns[7] = obj;
    return routerGuardTaskListColumns;
  };

  render() {
    const {
      taskList,
      taskListTotal,
      taskState,
      taskDate,
      loading,
      taskStateList,
      page,
    } = this.props;
    return (
      <div className={styles.taskManageContainer}>
        <div className={styles.header}>
          <Radio.Group value={taskState} onChange={this.onRadioChange}>
            {taskStateList.map(obj => (
              <Radio.Button key={obj.value} value={obj.value}>
                {`${obj.name} (${obj.number || 0})`}
              </Radio.Button>
            ))}
          </Radio.Group>
          <RangePicker
            showTime={true}
            format="YYYY-MM-DD HH:mm:ss"
            value={taskDate}
            onChange={this.onDateChange}
            onOpenChange={this.onDateOpenChange}
          />
          <Button type="primary" icon="plus" onClick={this.handleModalShow}>
            新建任务
          </Button>
        </div>
        <Table
          rowKey={record => record.id}
          columns={this.getColumn()}
          dataSource={taskList}
          size="middle"
          pagination={{
            showQuickJumper: true,
            current: page,
            pageSize: 10,
            total: taskListTotal,
            onChange: this.onPageChange,
          }}
          loading={loading}
          // scroll={{ x: true }}
        />
        <NewTask />
      </div>
    );
  }
}

export default TaskManage;
