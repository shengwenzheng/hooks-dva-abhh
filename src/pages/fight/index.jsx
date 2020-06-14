/* eslint-disable jsx-a11y/iframe-has-title */
import React, { createRef, Component, PureComponent } from 'react';
import Box from '@/components/Box';
import Header from './components/Header';
import LeftMenu from './components/LeftMenu';
import RealtimeAlert from './components/RealtimeAlert';
import RouteTravel from './components/RouteTravel';
import EndTask from './components/EndTask';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './index.scss';
import SKMapGL from './components/MapGL/index';

const PLAYER_ADDR = 'https://spjrca.hzos.hzs.zj/flv-player2/player/player.html';
const RECONNECTAPI = 'http://41.196.9.16:8008';

@connect(({ fight: { leftMenuVisible, taskStatus, videoData, securityDetail, id } }) => ({
  leftMenuVisible,
  taskStatus,
  videoData,
  securityDetail,
  id,
}))
class Fight extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: '100%',
      height: '100%',
      currentUrl: '',
      allScreenVideoShow: false,
    };
    this.turning = createRef();
    this.forward = createRef();
    this.middle = createRef();
    this.behind = createRef();
    this.allScreen = createRef();
    this.id = this.props.location.query.id;
  }

  refreshIframe(iframeClass) {
    try{
      console.log('刷新iframe：', iframeClass)
      const {videoData} = this.props;
      // document.getElementsByClassName(iframeClass)[0].getElementsByTagName('iframe')[0].contentWindow.location.reload(true);
      document.getElementsByClassName(iframeClass)[0].getElementsByTagName('iframe')[0].src = `${PLAYER_ADDR}?stream=${
        videoData[iframeClass]
      }&appId=${'abhh'}&reconnectAPI=${RECONNECTAPI}&deviceId=${this.getDeviceId(
        videoData[iframeClass],
      )}`
    }catch(err) {
      console.error('刷新iframe出错：',err)
    }
  }

  componentWillUpdate(next) {
    // console.log('更新props:', next.securityDetail, '当前的props:', this.props.securityDetail)
    if (next && next.securityDetail && this.props.securityDetail && next.securityDetail.id !== this.props.securityDetail.id) {
      this.openConfirmModal()
    }
  }

  componentDidMount() {
    this.clearAllTimer();
    const { securityDetail, dispatch } = this.props;
    this.getSecurityDetail();
    if (securityDetail && securityDetail.routeStatus === 100) return;
    // 初始化打开确认框
    this.openConfirmModal(!(securityDetail && securityDetail.routeStatus === 100));
    this.getRouteVideo();
    this.getAlermList();
    this.saveRef = ref => {
      this.refDom = ref;
    };
    window.addEventListener('resize', this.handleSize);
    document.addEventListener(
      'keydown',
      e => {
        switch (e.which) {
          case 49:
            this.refreshIframe('mainUrl')
            break;
          case 50:
            this.refreshIframe('firstUrl')
            break;
          case 51:
            this.refreshIframe('midUrl')
            break;
          case 52:
            this.refreshIframe('lastUrl')
            break;
          case 27:
            this.hideAllScreenVideo();
            break;
          default:
            break;
        }
      },
      false,
    );

    this.updateCarTimer();
    this.updatePoliceTimer();

    dispatch({
      type: 'fight/saveClearTimerFn',
      payload: {
        clearAllTimer: this.clearAllTimer.bind(this)
      }
    })
  }
  updateCarTimer() {
    let self = this;
    self.timer = setTimeout(() => {
      // 摄像头接口
      self.getRouteVideo();
      // 车辆位置接口
      self.getCarPosition();
      // 系统时间接口
      self.getServerStamp();
      self.saveNorm();
      self.updateCarTimer()
    }, 1000)
  }
  updatePoliceTimer() {
    let self = this;
    self.policeTimer = setTimeout(() => {
      // 警情接口
      self.getAlermList();
      // 警力接口
      self.getPoliceCount();
      self.updatePoliceTimer()
    }, 5000)
  }
  openConfirmModal(bool = true) {
    const { securityDetail, dispatch } = this.props;
    if (
      (securityDetail && securityDetail.routeStatus === 0) ||
      (securityDetail && securityDetail.routeStatus === 1)
    ) {
      dispatch({
        type: 'fight/save',
        payload: {
          confirmLicensePlateModalVisible: bool,
        },
      });
    }
  }
  componentWillUnmount() {
    this.clearAllTimer();
    // 移除监听事件
    window.removeEventListener('resize', this.handleSize);
    document.removeEventListener(
      'keydown',
      () => {
        console.log('所有事件已取消');
      },
    );
  }
  clearPoliceTimer() {
    clearInterval(this.policeTimer);
  }
  clearCarTimer() {
    clearInterval(this.timer);
  }
  clearAllTimer() {
    clearInterval(this.timer);
    clearInterval(this.policeTimer);
  }

  handleSize = () => {
    const { clientWidth, clientHeight } = this.refDom || {};
    this.setState({
      width: clientWidth,
      height: clientHeight,
    });
  };

  getSecurityDetail = () => {
    const { securityDetail, dispatch } = this.props;

    dispatch({
      type: 'fight/getSecurityDetail',
      // payload: { id: (securityDetail && securityDetail.id) || this.id },
      payload: { id: this.id },
    });
  };

  getRouteVideo = () => {
    const { securityDetail, dispatch } = this.props;
    if (
      securityDetail &&
      securityDetail.hasCommanderCarInfo &&
      (securityDetail.routeStatus === 1 || securityDetail.routeStatus === 2 || securityDetail.routeStatus === 3)
    ) {
      dispatch({
        type: 'fight/getRouteVideo',
        // payload: { id: securityDetail.id },
        payload: { id: this.id },
      });
    } else {
      dispatch({
        type: 'fight/save',
        payload: { videoData: null },
      });
    }
  };

  getAlermList = () => {
    const { securityDetail, dispatch } = this.props;
    if (
      (securityDetail && securityDetail.routeStatus === 1) ||
      (securityDetail && securityDetail.routeStatus === 2) ||
      (securityDetail && securityDetail.routeStatus === 3)
    ) {
      dispatch({
        type: 'fight/getAlermList',
        payload: { id: this.id },
        // payload: { id: securityDetail.id },
      });
    } else {
      dispatch({
        type: 'fight/save',
        payload: { alermList: [] },
      });
    }
  };

  saveNorm = () => {
    const { securityDetail, dispatch } = this.props;
    if (
      (securityDetail && securityDetail.routeStatus === 1) ||
      (securityDetail && securityDetail.routeStatus === 2)
    ) {
      dispatch({
        type: 'fight/setNorm',
        payload: securityDetail,
      });
    }
  };

  getServerStamp = () => {
    const { securityDetail, dispatch } = this.props;
    if (
      (securityDetail && securityDetail.routeStatus === 1) ||
      (securityDetail && securityDetail.routeStatus === 2) ||
      (securityDetail && securityDetail.routeStatus === 3)
    ) {
      dispatch({
        type: 'fight/getServerStamp',
      });
    }
  };

  getPoliceCount = () => {
    const { securityDetail, dispatch } = this.props;
    if (securityDetail && securityDetail.routeStatus) {
      if (securityDetail.routeStatus > 3) return;
      dispatch({
        type: 'fight/getPoliceCount',
      });
    }
  };

  getCarPosition = () => {
    const { securityDetail, dispatch } = this.props;
    if (
      securityDetail &&
      securityDetail.hasCommanderCarInfo &&
      (securityDetail.routeStatus === 1 || securityDetail.routeStatus === 2 || securityDetail.routeStatus === 3)
    ) {
      dispatch({
        type: 'fight/getCarPosition',
        payload: securityDetail.firstCarId,
      });
    } else {
      dispatch({
        type: 'fight/save',
        payload: { carPosition: null },
      });
    }
  };
  showAllScreenVideo = url => {
    console.log('当前全屏视频流地址：', url);
    this.setState({
      currentUrl: url,
      allScreenVideoShow: true,
    });
  };
  hideAllScreenVideo = () => {
    this.setState({
      currentUrl: '',
      allScreenVideoShow: false,
    });
  };
  getDeviceId = url => {
    let deviceId = url ? url.slice(url.indexOf('/', 8) + 1, url.lastIndexOf('/')) : '';
    return deviceId;
  };
  render() {
    const { leftMenuVisible, videoData } = this.props;
    const { width, height } = this.state;
    const appId = 'abhh';
    return (
      <div className={styles.fightContainer}>
        <LeftMenu />
        <div
          className={styles.body}
          style={leftMenuVisible ? { transform: 'translateX(316px)' } : null}
        >
          <Header />
          <div className={styles.middle}>
            <Box style={{ flexGrow: 1, height: '100%', marginRight: 16 }}>
              <RouteTravel />
            </Box>
            <Box style={{ flexShrink: 0, width: 220, height: '100%' }}>
              <RealtimeAlert />
            </Box>
          </div>
          <Box style={{ flex: 1, margin: '0 25px 25px 25px' }}>
            <Row style={{ height: '66%' }}>
              <Col span={14} style={{ background: '#2b2b2b' }} className={'mainUrl'}>
                  {videoData && videoData.mainUrl && (
                    <iframe
                      src={`${PLAYER_ADDR}?stream=${
                        videoData&&videoData.mainUrl
                      }&appId=${appId}&reconnectAPI=${RECONNECTAPI}&deviceId=${this.getDeviceId(
                        videoData&&videoData.mainUrl,
                      )}`}
                      className={styles.video}
                      autoPlay
                      ref={this.turning}
                    />
                  )}
                <div className={styles.videoMask} onDoubleClick={this.showAllScreenVideo.bind(this, videoData && videoData.mainUrl)}></div>
              </Col>
              <Col span={10}>
                <div ref={this.saveRef} className={styles.map}>
                  <SKMapGL width={width} height={height} />
                </div>
              </Col>
            </Row>
            <Row style={{ height: '34%' }}>
              <Col span={7} style={{ background: '#2b2b2b' }} className={'firstUrl'}>
                  {videoData && videoData.firstUrl && (
                    <iframe
                      src={`${PLAYER_ADDR}?stream=${
                        videoData.firstUrl
                      }&appId=${appId}&reconnectAPI=${RECONNECTAPI}&deviceId=${this.getDeviceId(
                        videoData && videoData.firstUrl,
                      )}`}
                      ref={this.forward}
                      className={styles.video}
                    />
                  )}
                <div className={styles.videoMask} onDoubleClick={this.showAllScreenVideo.bind(this, videoData && videoData.firstUrl)}></div>
              </Col>
              <Col span={7} style={{ background: '#2b2b2b' }} className={'midUrl'}>
                {videoData && videoData.midUrl && (
                  <iframe
                    src={`${PLAYER_ADDR}?stream=${
                      videoData.midUrl
                    }&appId=${appId}&reconnectAPI=${RECONNECTAPI}&deviceId=${this.getDeviceId(
                      videoData.midUrl,
                    )}`}
                    ref={this.middle}
                    className={styles.video}
                  />
                )}
                <div className={styles.videoMask} onDoubleClick={this.showAllScreenVideo.bind(this, videoData && videoData.midUrl)}></div>
              </Col>
              <Col span={7} style={{ background: '#2b2b2b' }} className={'lastUrl'}>
                {videoData && videoData.lastUrl && (
                  <iframe
                    src={`${PLAYER_ADDR}?stream=${
                      videoData.lastUrl
                    }&appId=${appId}&reconnectAPI=${RECONNECTAPI}&deviceId=${this.getDeviceId(
                      videoData.lastUrl,
                    )}`}
                    ref={this.behind}
                    className={styles.video}
                  />
                )}
                <div className={styles.videoMask} onDoubleClick={this.showAllScreenVideo.bind(this, videoData && videoData.lastUrl)}></div>
              </Col>
              <Col span={3}>
                <EndTask
                  clearCarTimer={this.clearCarTimer.bind(this)}
                  clearAllTimer={this.clearAllTimer.bind(this)}
                />
              </Col>
            </Row>
          </Box>
        </div>
        {this.state.allScreenVideoShow && (
          <div className={styles.videoBox}>
            {this.state.currentUrl &&
              <iframe
                src={`${PLAYER_ADDR}?stream=${
                  this.state.currentUrl
                }&appId=${appId}&reconnectAPI=${RECONNECTAPI}&deviceId=${this.getDeviceId(
                  this.state.currentUrl,
                )}`}
                ref={this.allScreen}
                className={styles.video}
              />
            }
            <div className={styles.closeMask} onDoubleClick={this.hideAllScreenVideo}></div>
          </div>
        )}
      </div>
    );
  }
}

export default Fight;
