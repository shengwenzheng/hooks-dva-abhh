import React, { Component } from 'react';
// import MenuItem from '@/components/MenuItem';
// import Link from 'umi/link';
import styles from './index.scss';

// const baseUrl = '/deploy';
// const routeGuard = `${baseUrl}/routeGuard`;
// const subwaySecurity = `${baseUrl}/subwaySecurity`;
// const circle135 = `${baseUrl}/135`;

class RouteGuard extends Component {
  render() {
    const {
      children,
      // location: { pathname },
    } = this.props;
    return (
      <div className={styles.routeGuardContainer}>
        {/* <nav className={styles.nav}>
          <Link to={routeGuard}>
            <MenuItem name="路线警卫" value="routeGuard" pathname={pathname} />
          </Link>
          <Link to={subwaySecurity}>
            <MenuItem name="地铁安保" value="subwaySecurity" pathname={pathname} />
          </Link>
          <Link to={circle135}>
            <MenuItem name="135快反圈" value="135" pathname={pathname} />
          </Link>
        </nav> */}
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
}

export default RouteGuard;
