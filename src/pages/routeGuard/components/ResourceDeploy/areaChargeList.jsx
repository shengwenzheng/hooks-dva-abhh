/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { isJSON } from '@/utils/tool';
import { Select } from 'antd';
import styles from './AreaChargeList.scss';

const { Option } = Select;

function AreaChargeList(props) {
  const { userOdpsList, disabled, stepCurrent, jurisdictionList, dispatch } = props;

  useEffect(() => {
    dispatch({ type: 'routeGuard/saveJurisdictionList' });
  }, [stepCurrent === 4]);

  const searchList = (keyword, deptCode) => {
    dispatch({
      type: 'routeGuard/throttleGetUserOdpsList',
      payload: { keyword, deptCode },
    });
  };

  const onSearchInputChange = (value, index) => {
    dispatch({ type: 'routeGuard/editJurisdictionList', payload: { value, index } });
  };

  const getNameAndPhone = ({ name, phone }) => {
    return `${name}/${phone}`;
  };

  return (
    <div className={styles.areaChargeList}>
      {jurisdictionList.map((obj, index) => (
        <div key={obj.name} className={styles.deptOption}>
          <span>{obj.name}</span>
          <Select
            placeholder="请选择责任人姓名/电话"
            showSearch
            value={isJSON(obj.value) ? getNameAndPhone(JSON.parse(obj.value)) : undefined}
            filterOption={false}
            showArrow={false}
            onSearch={value => searchList(value, obj.code)}
            onChange={value => onSearchInputChange(value, index)}
            notFoundContent={null}
            disabled={disabled}
          >
            {userOdpsList.map((obj, index) => (
              <Option key={index} value={JSON.stringify(obj)}>
                {getNameAndPhone(obj)}
              </Option>
            ))}
          </Select>
        </div>
      ))}
    </div>
  );
}

export default connect(
  ({ routeGuard: { userOdpsList, disabled, stepCurrent, jurisdictionList } }) => ({
    userOdpsList,

    disabled,
    stepCurrent,
    jurisdictionList,
  }),
)(AreaChargeList);
