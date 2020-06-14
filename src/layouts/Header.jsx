import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import { connect } from 'dva';
import styles from './Header.scss';
import VideoRecord from './components/videoRecord';

@connect(({ routeGuard: { displayName }, fight: { securityDetail }, router }) => ({
  displayName,
  securityDetail,
  router,
}))
class Header extends Component {
  onMenuClick = () => {
    this.props.dispatch({ type: 'routeGuard/logout' });
  };

  render() {
    const { displayName, securityDetail, router } = this.props;
    const { pathname } = router.location;
    const { name = '' } = securityDetail || {};
    return (
      <header className={styles.headerContainer}>
        <div className={styles.left}>
          <img className={styles.logo} src="/pwaLogo.png" alt="" />
          <span className={styles.title}>警务操作系统</span>
          <span className={styles.version}>V2.0</span>
          <span className={styles.divide}>|</span>
          <span className={styles.subtitle}>路线警卫</span>
        </div>
        {pathname.includes('fight') ? (
          <>
            <span className={styles.headTitle}>{name}</span>
            <VideoRecord />
          </>
        ) : null}

        <div className={styles.right}>
          <Dropdown
            overlay={
              <Menu onClick={this.onMenuClick}>
                <Menu.Item>
                  <span>退出</span>
                </Menu.Item>
              </Menu>
            }
            placement="bottomCenter"
          >
            <span className={styles.username}>{displayName}</span>
          </Dropdown>
        </div>
      </header>
    );
  }
}

export default Header;
