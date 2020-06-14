import React, { Component } from 'react';
import { connect } from 'dva';
import { Switch, Button, Timeline, Modal } from 'antd';
import { timeFormat } from '@/utils/tool';
import moment from 'moment';
import classnames from 'classnames';
import styles from './index.scss';

const { confirm } = Modal;

@connect(
  ({
    fight: {
      confirmLicensePlateModalVisible,
      taskStatus,
      securityDetail,
      systemStart,
      carStart,
      carArriveTime,
      systemClose,
      serverStamp,
      keepTime
    },
  }) => ({
    confirmLicensePlateModalVisible,
    taskStatus,
    securityDetail,
    systemStart,
    carStart,
    carArriveTime,
    systemClose,
    serverStamp,
    keepTime
  }),
)
class EndTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: '',
      systemStartVal: '',
      carStartVal: '',
      systemStartCountDown: 0,
      label: { label: <div /> },
    };
  }
  // componentWillReceiveProps(prevProps, nextProps) {
    // console.log(prevProps, nextProps, this.props)
    // if (prevProps.taskStatus !== nextProps.taskStatus) {
    //   this.getText(prevProps.taskStatus);
    // }
  // }
  formatDiffTime(time1, time2) {
    let diff = time1 - time2;
    diff = diff < 0 ? 0 : diff;
    return timeFormat(diff)
  }
  componentDidMount() {
    clearInterval(this.timer);
    this.updateAllValue()
    this.getText(this.props.taskStatus);
  }
  updateAllValue() {
    let self = this;
    self.timer = setTimeout(() => {
      const d = self.props.serverStamp.timeStamp || new Date().getTime();
      const sysStartTime = self.props.securityDetail && self.props.securityDetail.startTime;
      self.setState({
        currentTime: moment().format('HH:mm:ss'),
        systemStartVal: self.formatDiffTime(d, moment(self.props.systemStart).valueOf()),
        carStartVal: self.formatDiffTime(d, moment(self.props.carStart).valueOf()),
        systemStartCountDown: self.formatDiffTime(moment(sysStartTime || d).valueOf(), d)
      });
      self.updateAllValue()
      self.getText(self.props.taskStatus);
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fight/save',
      payload: {
        confirmLicensePlateModalVisible: true,
      },
    });
  };

  getText = status => {
    const { systemStart, carStart, carArriveTime, systemClose, keepTime } = this.props;
    const { systemStartVal, carStartVal, systemStartCountDown } = this.state;
    switch (status) {
      case 'config':
        this.setState({
          label: {
            center: (
              <>
                <p>任务开始倒计时</p>
                <p>{systemStartCountDown}</p>
              </>
            ),
            footer: (
              <span onClick={this.onChangeSystem}>开始任务</span>
            ),
            title: '任务未开始',
          },
        });
        break;
      case 'no':
        this.setState({
          label: {
            center: (
              <>
                <p>任务开始倒计时</p>
                <p>{systemStartCountDown}</p>
              </>
            ),
            footer: (
              <span onClick={this.onChangeSystem}>开始任务</span>
            ),
            title: '任务未开始',
          },
        });
        break;
      case 'ready':
        this.setState({
          label: {
            center: (
              <>
                <p>启动时间：{systemStart}</p>
                <p>历时：{systemStartVal}</p>
              </>
            ),
            footer: (
              <>
                <span className={styles.routeBtn} onClick={this.onChangeSystem}>结束任务</span>
                <span className={styles.carBtn} onClick={this.onChange}>车队出发</span>
              </>
            ),
            title: '任务已开始',
          },
        });
        break;
      case 'in':
        this.setState({
          label: {
            center: (
              <>
                <p>车队出发时间：</p>
                <p>{carStart}</p>
                <p>历时：{carStartVal}</p>
              </>
            ),
            footer: (
              <>
                <span className={styles.routeBtn} onClick={this.onChangeSystem}>结束任务</span>
                <span className={styles.carBtn} onClick={this.onChange}>车队到达</span>
              </>
            ),
            title: '车队行进中',
          },
        });
        break;
      case 'arrive':
        this.setState({
          label: {
            center: (
              <>
                <p>到达时间{carArriveTime}</p>
                <p>行进总时长：{keepTime}</p>
              </>
            ),
            footer: (
              <>
                <span className={styles.routeBtn} onClick={this.onChangeSystem}>结束任务</span>
                <span className={styles.carEndBtn}>车队到达</span>
              </>
            ),
            title: '车队已到达',
          },
        });
        break;
      case 'over':
        this.setState({
          label: {
            center: (
              <>
                <p>系统关闭时间：{systemClose}</p>
                <p>车队行进历时：{keepTime}</p>
                <p>车队已到达终点</p>
              </>
            ),
            footer: (
              <>
                <span className={styles.endRoute} onClick={() => {
                  let content = this.props.securityDetail.recordScreenPath || '未找到录屏文件';
                  confirm({
                    title: '',
                    content: content,
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {},
                  });
                }}>查看录屏</span>
              </>
            ),
            title: '任务已结束',
          },
        });
        break;
      default:
    }
  };

  onChangeSystem = bol => {
    const { dispatch, taskStatus, securityDetail, clearAllTimer } = this.props;
    if (taskStatus === 'config') {
      this.showModal();
    }
    let id = securityDetail && securityDetail.id;
    let confirmTitle = ''
    switch (taskStatus) {
      case 'config':
        confirmTitle = '任务未开始'
        break;
      case 'ready':
        confirmTitle = '任务已开始'
        break;
      case 'in':
        confirmTitle = '车队已出发'
        break;
      default:
        confirmTitle = '车队已到达'
        break;
    }
    if (taskStatus === 'ready' || taskStatus === 'in' || taskStatus === 'arrive') {
      confirm({
        title: confirmTitle,
        content: '若结束任务，将释放所有资源，无法重启系统，是否结束任务',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          dispatch({
            type: 'fight/taskFinish',
            payload: { id },
          });
          dispatch({
            type: 'saveNorm',
            payload: {
              surplus: 0,
              surplusTime: 0,
              surplusDistance: 0,
            },
          });
          clearAllTimer();
        },
      });
      return;
    } else if (taskStatus === 'over') {
      return false;
    }
    dispatch({
      type: 'fight/taskStart',
      payload: { id },
    });
  };

  onChange = () => {
    const { dispatch, taskStatus, securityDetail, clearCarTimer } = this.props;
    if (taskStatus === 'no' || taskStatus === 'config' || taskStatus === 'over') return;
    if (taskStatus === 'ready' && securityDetail && !securityDetail.hasCommanderCarInfo) {
      dispatch({
        type: 'fight/save',
        payload: {
          openComfirmModalVisible: true,
        },
      });
      return;
    }
    let params = { id: securityDetail.id };
    if (taskStatus === 'ready') {
      params = Object.assign(params, { routeStatus: securityDetail.routeStatus + 1 });
      dispatch({
        type: 'fight/setRouteStatus',
        payload: params,
      });
    } else if (taskStatus === 'in') {
      confirm({
        title: '确定车队已到达目的地?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          params = Object.assign(params, { routeStatus: securityDetail.routeStatus + 1 });
          dispatch({
            type: 'fight/setRouteStatus',
            payload: params,
          });
          clearCarTimer();
        },
      });
    }
  };

  render() {
    const { taskStatus } = this.props;
    const { label } = this.state;
    return (
      <div className={styles.taskStatus}>
        <div className={styles.center}>
          <div className={`${styles.outBox} ${styles['out-' + taskStatus]}`}>
            <div className={`${styles.innerBox} ${styles['inner-' + taskStatus]}`}>
              <span className={styles.title}>
                {label.title}
              </span>
              {label.center}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          {label.footer}
        </div>
      </div>
    );
  }
}

export default EndTask;
