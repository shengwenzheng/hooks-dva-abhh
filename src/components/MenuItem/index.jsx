import React, { Component } from 'react';
import styles from './index.scss';

class MenuItem extends Component {
  render() {
    const { name, value, pathname } = this.props;
    const active = pathname.includes(value);
    return (
      <div className={styles.menuItemContainer} style={active ? { backgroundColor: '#fff' } : null}>
        <div
          className={styles.icon}
          style={{
            backgroundImage: `url(${require(`@/assets/img/${value}-${
              active ? 'click' : 'normal'
            }.png`)})`,
          }}
        />
        <span className={active ? styles.active : null}>{name}</span>
      </div>
    );
  }
}

export default MenuItem;
