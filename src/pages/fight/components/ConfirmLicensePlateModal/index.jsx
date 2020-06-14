import React, { Component,createRef } from 'react';
import { Modal, Button, Select,Input  } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import styles from './index.scss';

const { Option } = Select;

@connect(({ fight: { confirmLicensePlateModalVisible,securityDetail,commanderList },routeGuard:{carList} }) => ({
  confirmLicensePlateModalVisible,
  securityDetail,
  commanderList,
  carList
}))
class ConfirmLicensePlateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commander: '',
      carnoSel: '',
      gpsCode: '',
      videoCode: ''
    }
    this.commander = createRef();
  }

  componentWillUpdate(next) {
    if (next.securityDetail && this.props.securityDetail && this.props.securityDetail.id !== next.securityDetail.id) {
      this.setState({
        commander: next.securityDetail.commander,
        carnoSel: next.securityDetail.firstCarNo,
        gpsCode: next.securityDetail.firstCarId,
        videoCode: next.securityDetail.firstCarCameraCode,
      })
    }
  }
  componentDidMount() {
    const {securityDetail} = this.props
    if (securityDetail) {
      this.setState({
        commander: securityDetail.commander,
        carnoSel: securityDetail.firstCarNo,
        gpsCode: securityDetail.firstCarId,
        videoCode: securityDetail.firstCarCameraCode,
      })
    }
  }
  handleModalCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fight/save',
      payload: {
        confirmLicensePlateModalVisible: false,
      },
    });
  };

  handleChange = (value) => {
    this.setState({
      commander: value
    })
  }

  handleSearch = name => {
    this.props.dispatch({
      type: 'fight/getCommander',
      payload: { name }
    });
  }

  inputChange = (value)=> {
    this.props.dispatch({
      type: 'fight/saveCommander',
      payload: value.target.value
    });
  }

  searchCarList = value => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/getCarList', payload: { carno: value } });
  };

  onCarNoChange = value => {
    if(value){
      let val  = JSON.parse(value);
      this.setState({
        carnoSel: val.carno,
        gpsCode: val.deviceId
      })
    }
  }

  gpsChange = e => {
    const value = e.target.value.replace(/\W/g, '').slice(0, 20);
    this.setState({
      gpsCode: value
    })
  }

  videoChange = e => {
    const value = e.target.value.replace(/\W/g, '').slice(0, 20);
    this.setState({
      videoCode: value
    })
  }

  putCarCommand = () => {
    const {securityDetail} = this.props;
    const { commander,carnoSel,gpsCode,videoCode, phonenumber } = this.state;
    if (securityDetail) {
      let params = {
        id: securityDetail.id,
        firstCarNo: carnoSel || securityDetail.firstCarNo,
        firstCarId: gpsCode || securityDetail.firstCarId,
        commander: commander || securityDetail.commander,
        firstCarCameraCode: videoCode,
        phonenumber: phonenumber || securityDetail.phonenumber
      }
      this.props.dispatch({
        type: 'fight/firstCarCommander',
        payload: params
      });
    }
  }

  render() {
    const { confirmLicensePlateModalVisible,carList,commanderList } = this.props;
    const options = commanderList.map(value => <Option key={value.jyname} label={`${value.jyname}${value.longmobile}`}>{value.jyname} {value.longmobile}</Option>)

    return (
      <Modal
        visible={confirmLicensePlateModalVisible}
        onCancel={this.handleModalCancel}
        maskClosable={false}
        footer={null}
        centered={true}
        width={510}
        destroyOnClose={true}
        bodyStyle={{ padding: 22 }}
      >
        <p className={styles.title}>请确认前导车的所有信息</p>
        <p className={styles.subscriptions}>前导车确认完成后，方可接入实时画面同时接入部分指标参数</p>
        <div className={styles.selectBox}>
          <span>前导车信息</span>
          <div>
            <Select
              style={{ width: 385 }}
              showSearch
              placeholder="请选择指挥员"
              optionFilterProp="children"
              onSearch={this.handleSearch}
              onChange={this.handleChange}
              value={this.state.commander}
              optionLabelProp="label"
              filterOption={(input, option) =>
                option.props.label.toLowerCase().includes(input.toLowerCase())
              }
            >
              {options}
            </Select>
            <div className={styles.leadingCar}>
              <Select
                placeholder='请选择车牌'
                showSearch
                onFocus={this.searchCarList}
                onChange={this.onCarNoChange}
                value={this.state.carnoSel}
                style={{ width: 120 }}>
                {carList.map(obj => (
                  <Option key={obj.carno} value={JSON.stringify(obj)}>
                    {obj.carno}
                  </Option>
                ))}
              </Select>
              <Input
              placeholder='请输入GPS编码'
              value={this.state.gpsCode}
              onChange={this.gpsChange}
              style={{ width: 120 }}/>
              <Input
              placeholder='请输入视频编码'
              value={this.state.videoCode}
              onChange={this.videoChange}
              style={{ width: 130 }}/>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.warn}>
            *若不配置，车队跟踪和前导车视频无法查看
          </div>
          <Button className={styles.button} type="primary" onClick={this.putCarCommand}>
            确定
          </Button>
          <Button className={styles.button} onClick={this.handleModalCancel}>
            取消
          </Button>
        </div>
      </Modal>
    );
  }
}

export default ConfirmLicensePlateModal;
