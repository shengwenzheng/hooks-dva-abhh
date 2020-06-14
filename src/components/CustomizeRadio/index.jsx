import React, { Component } from 'react';
import { Radio, Input } from 'antd';

class CustomizeRadio extends Component {
  onInputChange = e => {
    let value = e.target.value;
    if (value < 0) value = 0;
    else if (value > 9999) value = 9999;
    this.triggerChange({ input: value });
  };

  onRadioChange = e => {
    this.triggerChange({ radio: e.target.value });
  };

  triggerChange = changedValue => {
    const { onChange, value } = this.props;
    if (onChange) {
      onChange({
        ...value,
        ...changedValue,
      });
    }
  };

  render() {
    const { value: { radio, input } = {}, disabled } = this.props;
    return (
      <Radio.Group value={radio} onChange={this.onRadioChange} disabled={disabled}>
        <Radio value={0}>沿线0米</Radio>
        <Radio value={200}>沿线200米</Radio>
        <Radio value={300}>沿线300米</Radio>
        <Radio value={500}>沿线500米</Radio>
        <Radio value={1000}>
          {radio === 1000 ? (
            <>
              <Input
                style={{ width: 60 }}
                value={input}
                onChange={this.onInputChange}
                disabled={disabled}
                autoFocus
              />
              &ensp;米
            </>
          ) : (
            '自定义'
          )}
        </Radio>
      </Radio.Group>
    );
  }
}

export default CustomizeRadio;
