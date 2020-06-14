import { message } from 'antd';

export const isJSON = str => {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};

export function timeFormat(value) {
  if (!value) return 0;
  value = value / 1000;
  let str;
  let hour = Math.floor(value / 3600);
  let minute = Math.floor((value % 3600) / 60);
  let second = Math.floor((value % 3600) % 60);
  if (hour < 1 && minute < 1) {
    str = second + '秒';
  } else if (hour < 1) {
    str = minute + '分' + second + '秒';
  } else {
    str = hour + '时' + minute + '分' + second + '秒';
  }
  return str;
}

export function exportExcel(blob, filename = 'excel.xls') {
  if (!(blob && blob.size)) {
    message.info(`当前表格没有数据!`);
    return;
  }
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
    const tempLink = document.createElement('a'); // 创建一个a标签
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename); // 给a标签添加下载属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink); // 将a标签添加到body当中
    tempLink.click(); // 启动下载
    document.body.removeChild(tempLink); // 下载完毕删除a标签
    window.URL.revokeObjectURL(blobURL);
  }
}

export function exportFile(blob, filename = 'file') {
  const blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
  const tempLink = document.createElement('a'); // 创建一个a标签
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename); // 给a标签添加下载属性
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink); // 将a标签添加到body当中
  tempLink.click(); // 启动下载
  document.body.removeChild(tempLink); // 下载完毕删除a标签
  window.URL.revokeObjectURL(blobURL);
}
