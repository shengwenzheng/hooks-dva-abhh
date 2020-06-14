import React, { Component } from 'react';
import { Checkbox } from 'antd';
import { connect } from 'dva';
import { layerNameList } from '../config/config';
import styles from './index.scss';

// @connect(({ map: setLayerVisibilityFn }) => ({ setLayerVisibilityFn }))
class LayersControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotateV: 0,
      layerNameList,
      visibility: false,
    };
  }

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

  onChange = e => {
    const { checked, value, layerType } = e.target;
    const { layerNameList } = this.state;
    layerNameList[value].checked = checked;
    this.setState({ layerNameList });
    this.props.setLayerVisibilityFn(checked, layerType);
  };

  render() {
    const {} = this.props;
    const { rotateV, layerNameList, visibility } = this.state;
    return (
      <div className={styles.layersControlContainer}>
        <div className={styles.header} onClick={this.changeLegend}>
          <span className={styles.title}>防控图层</span>
          <img
            src={require('../../../../../assets/img/map/collapse.png')}
            style={{ transform: `rotateZ(${rotateV}deg)` }}
          />
        </div>
        <div className={styles.content} style={{ display: visibility ? 'block' : 'none' }}>
          {layerNameList.map(item => (
            <Checkbox
              checked={item.checked}
              value={item.id}
              onChange={this.onChange}
              key={'layername-' + item.id}
              layerType={item.layerType}
            >
              <span className={styles.name}>{item.name}</span>
            </Checkbox>
          ))}
        </div>
      </div>
    );
  }
}

export default connect(({ map }) => {
  return {
    setLayerVisibilityFn: map.setLayerVisibilityFn,
  };
})(LayersControl);
