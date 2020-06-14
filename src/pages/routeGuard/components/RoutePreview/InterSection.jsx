import React from 'react';
import { Checkbox } from 'antd';
import styles from './InterSection.scss';

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

function onChange(checkedValues) {
  console.log('checked = ', checkedValues);
}

function InterSection(props) {
  const { style, open } = props;
  return (
    <div className={styles.interSectionContainer} style={style}>
      <Checkbox.Group options={options} defaultValue={['Pear']} onChange={onChange} />
    </div>
  );
}

export default InterSection;
