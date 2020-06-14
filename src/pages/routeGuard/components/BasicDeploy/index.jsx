import React, { Component } from 'react';
import { Form, Input, Select, Button, DatePicker, Row, Col } from 'antd';
import CustomizeRadio from '@/components/CustomizeRadio';
import { taskLevelList, stepList } from '@/utils/config';
import moment from 'moment';
import { connect } from 'dva';
import styles from './index.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(
  ({
    routeGuard: {
      carList,
      controlRange,
      disabled,
      form: taskForm,
      id,
      commanderList,
      organizationList,
    },
  }) => ({
    carList,
    controlRange,
    disabled,
    taskForm,
    id,
    commanderList,
    organizationList,
  }),
)
class BasicDeploy extends Component {
  state = {
    current: 50,
  };

  handleSubmit = () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({ type: 'routeGuard/save', payload: { stepCurrent: 1, form: values } });
      }
    });
  };

  save = () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({ type: 'routeGuard/save', payload: { form: values } });
      }
    });
    dispatch({ type: 'routeGuard/completeDeploy' });
  };

  searchCarList = value => {
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/getCarList', payload: { carno: value } });
  };

  onCarNoChange = value => {
    const { deviceId, cameraId } = value ? JSON.parse(value) : {};
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ gpsCode: deviceId, videoCode: cameraId });
  };

  checkControlRange = (rule, value, callback) => {
    const { radio, input } = value || {};
    if (!value || (radio === 1000 && !input)) callback('请输入管控范围');
    callback();
  };

  searchList = value => {
    this.setState({ current: 50 });
    const { dispatch } = this.props;
    dispatch({ type: 'routeGuard/throttleGetCommanderList', payload: { name: value } });
  };

  onPopupScroll = e => {
    const { scrollTop, offsetHeight, scrollHeight } = e.target;
    if (scrollTop + offsetHeight === scrollHeight) {
      this.setState(state => ({ current: state.current + 50 }));
    }
  };

  render() {
    const {
      carList,
      form,
      style,
      disabled,
      taskForm,
      id,
      onCancel,
      commanderList,
      organizationList,
    } = this.props;
    const { current } = this.state;
    const { getFieldDecorator } = form;
    const {
      taskName,
      taskLevel,
      startEndTime,
      commander,
      frontCar,
      gpsCode,
      videoCode,
      controlRange,
      sharedObject,
    } = taskForm;
    return (
      <Form style={style} className={styles.form} labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="任务名称">
          {getFieldDecorator('taskName', {
            getValueFromEvent(e) {
              const value = e.target.value;
              if (value.length > 16) return value.slice(0, 16);
              return value;
            },
            rules: [
              {
                transform: value => value && value.trim(),
              },
              {
                required: true,
                message: '请输入必填项',
              },
            ],
            initialValue: taskName,
          })(<Input placeholder="请输入任务名称" disabled={disabled} />)}
        </Form.Item>
        <Form.Item label="任务等级">
          {getFieldDecorator('taskLevel', {
            rules: [
              {
                required: true,
                message: '请输入必填项',
              },
            ],
            initialValue: taskLevel,
          })(
            <Select placeholder="请选择任务等级" disabled={disabled}>
              {taskLevelList.map(obj => (
                <Option key={obj.value} value={obj.value}>
                  {obj.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="起止时间">
          {getFieldDecorator('startEndTime', {
            rules: [
              {
                required: true,
                message: '请输入必填项',
              },
            ],
            initialValue: startEndTime,
          })(
            <RangePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={true}
              disabled={disabled}
              disabledDate={current =>
                current &&
                current <
                  moment()
                    .endOf('day')
                    .subtract(1, 'day')
              }
            />,
          )}
        </Form.Item>
        <Form.Item label="前导车信息">
          {getFieldDecorator('commander', { initialValue: commander })(
            <Select
              placeholder="请输入指挥员姓名"
              showSearch
              filterOption={false}
              showArrow={false}
              onSearch={this.searchList}
              onPopupScroll={this.onPopupScroll}
              notFoundContent={null}
              disabled={disabled}
            >
              {commanderList.slice(0, current).map(obj => (
                <Option key={obj.idcard} value={`${obj.jyname}/${obj.longmobile}`}>
                  {obj.jyname}/{obj.longmobile}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Row gutter={8}>
          <Col span={7} />
          <Col span={4}>
            <Form.Item wrapperCol={{ span: 24 }}>
              {getFieldDecorator('frontCar', { initialValue: frontCar })(
                <Select
                  placeholder="请选择车牌"
                  showSearch
                  filterOption={false}
                  onSearch={this.searchCarList}
                  onFocus={this.searchCarList}
                  onChange={this.onCarNoChange}
                  disabled={disabled}
                >
                  {carList.map(obj => (
                    <Option key={obj.carno} value={JSON.stringify(obj)}>
                      {obj.carno}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item wrapperCol={{ span: 24 }}>
              {getFieldDecorator('gpsCode', {
                getValueFromEvent(e) {
                  const value = e.target.value;
                  if (value.length > 20) return value.slice(0, 20);
                  return value;
                },
                rules: [
                  {
                    transform: value => value && value.trim(),
                  },
                  {
                    pattern: /^[a-zA-Z0-9]*$/,
                    message: '只能输入数字或者英文',
                  },
                ],
                initialValue: gpsCode,
              })(<Input placeholder="请输入GPS编码" disabled={disabled} />)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item wrapperCol={{ span: 24 }}>
              {getFieldDecorator('videoCode', {
                getValueFromEvent(e) {
                  const value = e.target.value;
                  if (value.length > 20) return value.slice(0, 20);
                  return value;
                },
                rules: [
                  {
                    transform: value => value && value.trim(),
                  },
                  {
                    pattern: /^[a-zA-Z0-9]*$/,
                    message: '只能输入数字或者英文',
                  },
                ],
                initialValue: videoCode,
              })(<Input placeholder="请输入视频编码" disabled={disabled} />)}
            </Form.Item>
          </Col>
          <Col span={5} />
        </Row>
        <Form.Item label="管控范围" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('controlRange', {
            rules: [
              { validator: this.checkControlRange },
              {
                required: true,
                message: '请输入必填项',
              },
            ],
            initialValue: controlRange,
          })(<CustomizeRadio disabled={disabled} />)}
        </Form.Item>
        <Form.Item label="共享对象">
          {getFieldDecorator('sharedObject', {
            initialValue: sharedObject,
          })(
            <Select placeholder="请选择共享单位" disabled={disabled} mode="multiple">
              {organizationList.map(obj => (
                <Option key={obj.orgId} value={obj.orgId}>
                  {obj.orgName}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <div className={styles.footer}>
          {(id === 0 || disabled) && (
            <Button
              className={styles.button}
              type="primary"
              shape="round"
              size="large"
              onClick={this.handleSubmit}
            >
              下一步 : {stepList[1]}
            </Button>
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
      </Form>
    );
  }
}

const WrappedBasicDeploy = Form.create({ name: 'basicDeploy' })(BasicDeploy);

export default WrappedBasicDeploy;
