import React, { useState } from 'react';
import { useDispatch } from 'dva';
import RecordRTC from 'recordrtc';
import { exportFile } from '@/utils/tool';
import { Button, message } from 'antd';
import styles from './index.scss';

let recorder = null;

const startRecord = changeStatus => {
  if (!navigator.mediaDevices.getDisplayMedia) {
    message.error('您的浏览器不支持录屏');
    return;
  }
  navigator.mediaDevices
    .getDisplayMedia({
      video: true,
    })
    .then(stream => {
      recorder = RecordRTC(stream, {
        type: 'video',
      });
      recorder.startRecording();
      changeStatus(true);
      recorder.screen = stream;
    });
};

const stopRecord = (changeStatus, dispatch) => {
  recorder &&
    recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      exportFile(blob, 'video');
      recorder.screen.stop();
      recorder.destroy();
      changeStatus(false);
      recorder = null;
    });
  dispatch({ type: 'fight/editRouteTask' });
};

function VideoRecord() {
  const [recordingStatus, changeStatus] = useState(false);
  const dispatch = useDispatch();
  return (
    <div className={styles.record}>
      <Button
        type="primary"
        onClick={
          !recordingStatus
            ? startRecord.bind(this, changeStatus)
            : stopRecord.bind(this, changeStatus, dispatch)
        }
        style={{ marginRight: 20 }}
      >
        <div className={styles.icon}>
          <div
            className={!recordingStatus ? styles.normalIconInner : styles.recordingIconInner}
          ></div>
        </div>
        {!recordingStatus ? '启动录屏' : '录屏中...'}
      </Button>
    </div>
  );
}

export default VideoRecord;
