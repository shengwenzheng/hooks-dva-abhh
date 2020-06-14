import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import Folder from './Folder';
import Route from './Route';
import { connect } from 'dva';
import Link from 'umi/link';
import arrowImg from '@/assets/img/arrow.png';
import styles from './index.scss';
import router from 'umi/router';

@connect(({ fight: { leftMenuVisible, taskList, clearAllTimer }, router: { location } }) => ({
  leftMenuVisible,
  taskList,
  location,
  clearAllTimer
}))
class LeftMenu extends Component {
  handleLeftMenuVisible = () => {
    const { dispatch, leftMenuVisible } = this.props;
    dispatch({
      type: 'fight/save',
      payload: {
        leftMenuVisible: !leftMenuVisible,
      },
    });
  };

  onFolderClick = obj => {
    obj.click = obj.children && obj.children.length ? !obj.click : false;
    const { dispatch, taskList } = this.props;
    dispatch({
      type: 'fight/save',
      payload: {
        taskList: [...taskList],
      },
    });
  };

  onRouteClick = id => {
    // window.history.replaceState({}, '', `fight?id=${id}`);
    this.props.clearAllTimer();
    router.push({
      pathname: '/fight',
      query: {
        id,
      },
    });

    this.props.dispatch({
      type: 'fight/getSecurityDetail',
      payload: { id },
    });
  };

  render() {
    const { leftMenuVisible, taskList } = this.props;
    return (
      <div
        className={styles.leftMenuContainer}
        style={leftMenuVisible ? { transform: 'translateX(316px)' } : null}
      >
        <div className={styles.title}>任务列表</div>
        <ul className={styles.content}>
          {taskList.map(obj => (
            <li key={obj.name} className={styles.folder}>
              <Folder
                name={obj.name}
                click={obj.click}
                total={obj.children && obj.children.length}
                onClick={this.onFolderClick.bind(this, obj)}
              />
              {obj.children ? (
                <ul
                  className={styles.routeContainer}
                  style={{ height: obj.click ? obj.children.length * 50 : 0 }}
                >
                  {obj.click &&
                    obj.children.map(childrenObj => (
                      <li key={childrenObj.name} className={styles.route}>
                        <img src={arrowImg} alt="" />
                        <Route
                          name={childrenObj.name}
                          status={childrenObj.state}
                          onClick={this.onRouteClick.bind(this, childrenObj.id)}
                        />
                      </li>
                    ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <Button type="primary">
            <Link to="/deploy">前往配置页</Link>
          </Button>
        </div>
        <div className={styles.button} role="button" onClick={this.handleLeftMenuVisible}>
          <Icon type={leftMenuVisible ? 'left' : 'right'} />
        </div>
      </div>
    );
  }
}

export default LeftMenu;
