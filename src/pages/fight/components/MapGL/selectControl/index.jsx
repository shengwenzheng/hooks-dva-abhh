import React, { Component } from 'react';
import { connect } from 'dva';
import { Editor, EditorModes, RenderStates } from 'react-map-gl-draw';
import defaultViewState from '../config/defaultViewState';
import Styles from './index.scss';
import { getFeatureStyle, getEditHandleStyle } from '../style';

class SelectControl extends Component {
  constructor(props) {
    super(props);
    this._editorRef = null;
    this.state = {
      viewport: defaultViewState,
      mode: EditorModes.READ_ONLY,
      selectedFeatureIndex: null,
      renderState: RenderStates.INACTIVE,
      iconData: [
        {
          coordinates: [120.2, 30.2],
          // image: require('@/assets/img/map/chahao.png'),
          width: 26,
          height: 26,
        },
      ],
    };
    this.cancelImg = require('@/assets/img/map/chahao.png');
  }

  _renderDrawTools = () => {
    // copy from mapbox
    return (
      <div className="mapboxgl-ctrl-top-left">
        <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
            title="Polygon tool (p)"
            onClick={() => this.setState({ mode: EditorModes.DRAW_RECTANGLE })}
          />
          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
            title="Delete"
            onClick={this._onDelete}
          />
        </div>
      </div>
    );
  };

  _onSelect = options => {
    console.log('################################_onSelect');
    this.setState({ selectedFeatureIndex: options && options.selectedFeatureIndex });
  };

  _onDelete = () => {
    const selectedIndex = this.state.selectedFeatureIndex;
    if (selectedIndex !== null && selectedIndex >= 0) {
      this._editorRef.deleteFeatures(selectedIndex);
    }
  };

  _onUpdate = ({ editType, features }) => {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@_onUpdate', features);
    if (editType === 'addFeature') {
      this.setState({
        mode: EditorModes.READ_ONLY,
      });
      this.setState({
        renderState: EditorModes.CLOSING,
      });
      const fs = this._editorRef.getFeatures();
      this.props.dispatch({
        type: 'map/setCloseIconData',
        payload: {
          closeIconData: [
            {
              coordinates: [120.2, 30.2],
              image: this.cancelImg,
              width: 16,
              height: 16,
            },
          ],
        },
      });
    }
  };
  _onAdd = e => {
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$_onAdd', e);
  };

  dd = () => this.setState({ mode: EditorModes.DRAW_RECTANGLE });

  render() {
    const { viewport, mode, renderState } = this.state;
    return (
      <div className={Styles.selectControl} onClick={this.props.onSelect}>
        <img src={require('@/assets/img/map/polygonSelect.png')} width={15} height={15} />
        <span className={Styles.title}>框选</span>
        {/*<Editor*/}
        {/*  ref={_ => (this._editorRef = _)}*/}
        {/*  style={{width: '100%', height: '100%'}}*/}
        {/*  clickRadius={18}*/}
        {/*  mode={mode}*/}
        {/*  renderState={renderState}*/}
        {/*  onSelect={this._onSelect}*/}
        {/*  onUpdate={this._onUpdate}*/}
        {/*  onAdd={this._onAdd}*/}
        {/*  editHandleShape={'circle'}*/}
        {/*  featureStyle={getFeatureStyle}*/}
        {/*  editHandleStyle={getEditHandleStyle}*/}
        {/*/>*/}
      </div>
    );
  }
}

export default connect(({ map }) => {
  return {};
})(SelectControl);
