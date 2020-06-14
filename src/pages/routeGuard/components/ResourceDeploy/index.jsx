import React, { Component } from 'react';
import { Button, Upload, Select, Icon } from 'antd';
import AreaChargeList from './areaChargeList';
import { connect } from 'dva';
import { stepList } from '@/utils/config';
import { uploadCameraExcel, uploadMapExcel } from '@/services/routeGuard';
import Map from '../Map';
// import keyPointImg from '@/assets/img/keyPoint.png';
import downloadImg from '@/assets/img/download.png';
import styles from './index.scss';

const { Option } = Select;

@connect(
  ({
    routeGuard: { fileList, keyPointList, controlList, control, stepCurrent, disabled, id, routes },
    loading,
  }) => ({
    fileList,
    keyPointList,
    controlList,
    control,
    stepCurrent,
    disabled,
    id,
    routes,
    loading: loading.effects['routeGuard/addRouteTask'],
  }),
)
class ResourceDeploy extends Component {
  state = {
    loading1: false,
    loading2: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/getControlList' });
  }

  goPrev = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/save', payload: { stepCurrent: 3 } });
  };

  onMapUploadChange = info => {
    const { status, response } = info.file;
    const { dispatch } = this.props;
    if (status === 'uploading') {
      this.setState({ loading1: true });
      return;
    }
    if (status === 'done') {
      this.setState({ loading1: false });
      const { data } = response;
      dispatch({ type: 'routeGuard/save', payload: { mapList: data } });
    }
  };

  onCameraUploadChange = info => {
    const { status, response } = info.file;
    const { dispatch } = this.props;
    if (status === 'uploading') {
      this.setState({ loading2: true });
      return;
    }
    if (status === 'done') {
      this.setState({ loading2: false });
      const data = response.data;
      dispatch({ type: 'routeGuard/save', payload: { cameraList: data } });
    }
  };

  insertKeyPoint = index => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/insertKeyPoint', payload: { index } });
  };

  deleteKeyPoint = index => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/deleteKeyPoint', payload: { index } });
  };

  onKeyPointInputChange = (e, index, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeGuard/saveKeyPoint',
      payload: { value: e.target.value, index, type },
    });
  };

  onControlChange = value => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/save', payload: { control: value } });
  };

  completeDeploy = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/completeDeploy' });
  };

  downloadCameraExcel = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/downloadCameraExcel' });
  };

  downloadMapExcel = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/downloadMapExcel' });
  };

  render() {
    const {
      style,
      // fileList,
      controlList,
      control,
      loading,
      stepCurrent,
      disabled,
      id,
      onCancel,
    } = this.props;
    const { loading1, loading2 } = this.state;
    return (
      <div className={styles.resourceDeployContainer} style={style}>
        <div className={styles.content}>
          <div className={styles.left}>
            <p className={styles.title}>
              地图资源配置
              <a download href="/map.xlsx" className={styles.download}>
                <img src={downloadImg} alt="." />
                模板下载
              </a>
            </p>
            {/* 地图资源列表导入导出 */}
            <div className={styles.body}>
              <Upload
                accept=".xls,.xlsx"
                action={uploadMapExcel}
                showUploadList={false}
                onChange={this.onMapUploadChange}
              >
                <Button disabled={disabled}>
                  {/* <img src={keyPointImg} alt="." /> */}
                  {loading1 && <Icon type="loading" />}
                  制高点列表导入
                </Button>
              </Upload>
              <Button disabled={disabled} onClick={this.downloadMapExcel}>
                当前数据导出
              </Button>
            </div>
            <p className={styles.title}>
              选择设备列表
              <a download href="/camera.xls" className={styles.download}>
                <img src={downloadImg} alt="下载" />
                模板下载
              </a>
            </p>
            {/* 设备列表导入导出 */}
            <div className={styles.body}>
              <Upload
                accept=".xls,.xlsx"
                action={uploadCameraExcel}
                showUploadList={false}
                onChange={this.onCameraUploadChange}
              >
                <Button disabled={disabled}>
                  {loading2 && <Icon type="loading" />}
                  设备列表导入
                </Button>
              </Upload>
              <Button disabled={disabled} onClick={this.downloadCameraExcel}>
                当前数据导出
              </Button>
            </div>
            <p className={styles.title}>请选择布控专题库</p>
            <div className={styles.body}>
              <Select
                placeholder="请选择布控专题库"
                style={{ width: '100%' }}
                labelInValue
                value={control}
                onChange={this.onControlChange}
                disabled={disabled}
              >
                {controlList.map(obj => (
                  <Option key={obj.code} value={obj.code}>
                    {obj.mc}
                  </Option>
                ))}
              </Select>
            </div>
            <p className={styles.title}>辖区负责人配置</p>
            <div className={styles.body}>
              <AreaChargeList />
            </div>
          </div>
          <div className={styles.right}>{stepCurrent === 4 ? <Map /> : null}</div>
        </div>
        <div className={styles.footer}>
          {(id === 0 || disabled) && (
            <>
              <Button type="primary" shape="round" size="large" onClick={this.goPrev}>
                上一步 : {stepList[3]}
              </Button>
              <Button
                className={styles.greenButton}
                type="primary"
                shape="round"
                size="large"
                onClick={this.completeDeploy}
                disabled={loading || disabled}
              >
                完成配置
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
                onClick={this.completeDeploy}
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

export default ResourceDeploy;
