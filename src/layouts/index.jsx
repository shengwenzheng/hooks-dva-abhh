import React, { Component } from 'react';
import { addMask } from 'g-mask';
import { connect } from 'dva';
import Header from './Header';
import styles from './index.scss';

@connect(({ routeGuard: { displayName } }) => ({
  displayName,
}))
class index extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'routeGuard/getUserInfo' });
    addMask([this.props.displayName, '{date}', '192.168.0.1']);
  }

  componentDidUpdate(prevProps, prevState) {
    addMask([this.props.displayName, '{date}', '192.168.0.1']);
  }

  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>{children}</main>
      </div>
    );
  }
}

export default index;
