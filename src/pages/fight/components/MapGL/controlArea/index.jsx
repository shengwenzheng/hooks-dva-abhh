import React, { Component, createRef } from 'react';
import { Radio, Input, message, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.scss';

let pass = true;
class ControlArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotateV: 0,
      visibility: false,
      value: -1,
      text: '',
    };
    this.titleRef = createRef();
  }

  /**
   * 区域范围选择
   * @param e
   */
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
    const num = e.target.value;
    let title = '';
    switch (num) {
      case 0:
        title = '0米';
        break;
      case 200:
        title = '200米';
        break;
      case 300:
        title = '300米';
        break;
      case 500:
        title = '500米';
        break;
      case 1000:
        title = this.state.text === '' ? null : this.state.text;
        break;
      default:
        title = this.state.text === '' ? null : this.state.text;
    }
    if (title === null) {
      message.warning('请先输入再选择');
    } else {
      this.props.dispatch({
        type: 'map/setControlArea',
        payload: {
          controlArea: title.replace(/[^0-9]/gi, ''),
        },
      });
    }
  };
  // input 取值
  onChangeValue = e => {
    this.setState({
      text: e.target.value,
    });
  };
  changeLegend = e => {
    let visibility = true;
    let imgEle = e.target.getElementsByTagName('img')[0];
    if (!imgEle) {
      imgEle = e.target.parentElement.getElementsByTagName('img')[0];
    }
    if (!imgEle) {
      imgEle = e.target;
    }
    if (imgEle.style.transform.indexOf('180') > -1) {
      if (imgEle) imgEle.style.transform = 'rotateZ(0deg)';
      visibility = false;
    } else {
      if (imgEle) imgEle.style.transform = 'rotateZ(180deg)';
      visibility = true;
    }
    this.setState({ visibility });
  };
  customBufferHandler = () => {
    const title = this.state.text;
    this.props.dispatch({
      type: 'map/setControlArea',
      payload: {
        controlArea: title.replace(/[^0-9]/gi, ''),
      },
    });
    this.titleRef.current.click();
    this.setState({
      value: 1000,
    });
  };
  render() {
    const { rotateV, visibility, value } = this.state;
    const { preventionScope = 0 } = this.props.securityDetail || {};
    if (preventionScope > 0 && pass) {
      this.props.dispatch({
        type: 'map/setControlArea',
        payload: {
          controlArea: preventionScope || 0,
        },
      });
      pass = false;
    }

    let checkedValue = preventionScope > 500 ? 1000 : preventionScope;
    if (-1 < value) checkedValue = value;
    return (
      <div className={styles.controlArea}>
        <div className={styles.header} onClick={this.changeLegend} ref={this.titleRef}>
          <span className={styles.title}>管控范围</span>
          <img
            src={require('../../../../../assets/img/map/collapse.png')}
            style={{ transform: `rotateZ(${rotateV}deg)` }}
          />
        </div>
        <div className={styles.content} style={{ display: visibility ? 'block' : 'none' }}>
          <Radio.Group onChange={this.onChange} value={checkedValue}>
            <Radio className={styles.radio} value={0}>
              <span className={this.state.value === 1 ? styles.selectedName : styles.name}>
                0米
              </span>
            </Radio>
            <Radio className={styles.radio} value={200}>
              <span className={this.state.value === 2 ? styles.selectedName : styles.name}>
                200米
              </span>
            </Radio>
            <Radio className={styles.radio} value={300}>
              <span className={this.state.value === 3 ? styles.selectedName : styles.name}>
                300米
              </span>
            </Radio>
            <Radio className={styles.radio} value={500}>
              <span className={this.state.value === 4 ? styles.selectedName : styles.name}>
                500米
              </span>
            </Radio>
            <Radio className={styles.radio} value={1000}>
              <span className={this.state.value === 5 ? styles.selectedName : styles.name}>
                <Input
                  value={this.state.text}
                  onChange={this.onChangeValue}
                  style={{ width: 48, height: 20 }}
                  placeholder="自定义"
                />
              </span>
            </Radio>
          </Radio.Group>
          <Button onClick={this.customBufferHandler} size='small' type="primary"
                  style={{'display': this.state.text ? 'block': 'none','margin': '5px 0px 0px 32px'}}
          >确定</Button>
        </div>
      </div>
    );
  }
}
export default connect(({ map, fight }) => {
  return {
    securityDetail: fight.securityDetail,
  };
})(ControlArea);
