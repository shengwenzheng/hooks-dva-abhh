export const routerGuardTaskListColumns = [
  {
    title: '序号',
    key: 'index',
    align: 'center',
    width: 60,
    render: (text, record, index) => {
      return index + 1;
    },
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    align: 'center',
    width: 150,
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
    align: 'center',
    width: 100,
  },
  {
    title: '任务等级',
    key: 'level',
    align: 'center',
    width: 100,
    render: (text, record, index) => {
      const res = taskLevelList.find(obj => obj.value === record.level);
      return res ? res.name : '';
    },
  },
  {
    title: '预计起止时间',
    key: 'startEndTime',
    align: 'center',
    width: 180,
    render: (text, record, index) => {
      return (
        <>
          <p>&ensp;{record.startTime}</p>
          <p>-{record.endTime}</p>
        </>
      );
    },
  },
  {
    title: '线路起止点',
    key: 'startEndPoint',
    align: 'center',
    width: 200,
    render: (text, record, index) => {
      return (
        <>
          <p>&ensp;{record.start}</p>
          <p>-{record.end}</p>
        </>
      );
    },
  },
  {
    title: '状态',
    key: 'state',
    align: 'center',
    width: 100,
    render: (text, record, index) => {
      const res = taskStateList.find(obj => obj.value === record.state);
      return res ? res.name : '';
    },
  },
  // {
  //   title: '操作',
  //   dataIndex: 'name',
  // },
];

export const taskLevelList = [
  { value: 1, name: '中宾一级' },
  { value: 2, name: '中宾二级' },
  { value: 3, name: '中宾三级' },
  { value: 4, name: '外宾一级' },
  { value: 5, name: '外宾二级' },
  { value: 6, name: '外宾三级' },
  { value: 7, name: '会议活动' },
  { value: 8, name: '特殊照顾' },
];

export const taskStateList = [
  { value: 0, name: '未执行' },
  { value: 1, name: '执行中' },
  { value: 2, name: '已完成' },
];

export const stepList = ['基本配置', '起止点配置', '路线配置', '路口选择', '资源配置'];

export const ak = 'ec85d3648154874552835438ac6a02b2';
