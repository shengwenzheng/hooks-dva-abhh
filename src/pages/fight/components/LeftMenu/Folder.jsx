import React, { Component } from 'react';
import styles from './Folder.scss';
import img from '@/assets/img/folder.png';

class Folder extends Component {
  getFolderStyle = () => {
    const { click, total } = this.props;
    if (!total) return { cursor: 'not-allowed' };
    if (click) return { backgroundColor: '#fff', borderColor: '#2950B8' };
  };

  render() {
    const { name, total, click, onClick } = this.props;
    return (
      <div className={styles.folderContainer} style={this.getFolderStyle()} onClick={onClick}>
        <div className={styles.status} style={click ? { backgroundColor: '#2950B8' } : null} />
        <img src={img} alt="" />
        <span className={styles.name}>{name}</span>
        <span className={styles.right}>共{total || 0}个</span>
      </div>
    );
  }
}

export default Folder;
