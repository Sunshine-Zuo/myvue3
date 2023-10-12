import request from "./request.js";

//单文件上传
// export const UploadFile = import.meta.env.VITE_API_URL + '/apiAdmin/api/wall/upload'

//test
export const uploadFile = (query) => {
  return request({
    url: "/api/wall/upload",
    method: "post",
    data: query,
    // method: 'post',
    // data: query
    isUploadFile: true,
  });
};
//下面两个是当前登录用户相关
// export const login = (query) => {
//   return request({
//     url: "/apiAdmin/v1/auth/login/employee/2/web",
//     method: "post",
//     data: { ...query, clientType: 'web' },
//   });
// };
export const login = (query) => {
  return request({
    url: "/apiAdmin/v1/auth/login/employee/B7/web",
    method: "post",
    data: { ...query, clientType: 'web' },
  });
};
// 获取用户信息
export const getCurrentUserInfo = (query) => {
  return request({
    url: "/apiAdmin/v1/auth/login/employee/currentUser",
    method: "get",
    params: query,
  });
};

//下面是用户管理页面相关
// 获取用户分组列表
export const getCompTree = (query) => {
  return request({
    url: "/apiAdmin/v1/entUserDept/userCompanyTree",
    method: "get",
    params: query,
  });
};
//添加用户分组
export const addCompTree = (query) => {
  return request({
    url: "/apiAdmin/v1/entUserDept/add",
    method: "post",
    data: query,
  });
};
//添加用户
export const addUser = (query) => {
  return request({
    url: "/apiAdmin/v1/entUserDept/add",
    method: "post",
    data: query,
  });
};
//修改用户
export const editUser = (query) => {
  return request({
    url: "/apiAdmin/v1/entUserDept/update",
    method: "put",
    data: query,
  });
};
// 获取用户列表
export const getUserList = (query) => {
  return request({
    url: "/apiAdmin/v1/entUserDept/userCompanyList",
    method: "get",
    params: query,
  });
};
//批量启用/禁用用户
export const batchEnableUser = (query) => {
  return request({
    url: "/apiAdmin/v1/auth/accounts/employees/batchEnable",
    method: "put",
    data: query,
  });
};


// 获取设备列表
export const getDeviceList = (query) => {
  return request({
    url: "/apiAdmin/api/trussDevices/page",
    method: "get",
    params: query,
  });
};
// 获取设备详情
export const getDeviceInfo = (query) => {
  return request({
    url: "/apiAdmin/api/trussDevices/" + query.id,
    method: "get",
  });
};
//添加设备
export const addDevice = (query) => {
  return request({
    url: "/apiAdmin/api/trussDevices/batchSave",
    method: "post",
    params: query,
  });
};
//修改设备
export const editDevice = (query) => {
  return request({
    url: "/apiAdmin/api/trussDevices",
    method: "put",
    data: query,
  });
};
//删除设备
export const deleteDevice = (query) => {
  return request({
    url: "/apiAdmin/api/trussDevices",
    method: "delete",
    params: query,
  });
};
//新增设备绑定
export const addDeviceBinding = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/batchNewSave",
    method: "post",
    data: query,
  });
};
//整个套件绑定到
export const tagDeviceBinding = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/batchKitSave",
    method: "post",
    data: query,
  });
};

//下面的绑定解绑是用于 项目设备管理 中的，与上面的新增绑定不同概念
//批量绑定
export const startUseBatch = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/batchSave",
    method: "post",
    params: query,
  });
};
//批量解绑
export const stopUseBatch = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/batchUntie",
    method: "post",
    params: query,
  });
};
//整个项目设备全部解绑
export const stopUseProject = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/projectsUntie",
    method: "post",
    params: query,
  });
};


// 获取标签列表
export const getTagList = (query) => {
  return request({
    url: "/apiAdmin/api/trussTags/page",
    method: "get",
    params: query,
  });
};
// 获取标签详情
export const getTagInfo = (query) => {
  return request({
    url: "/apiAdmin/api/trussTags/" + query.id,
    method: "get",
  });
};
//添加标签
export const addTag = (query) => {
  return request({
    url: "/apiAdmin/api/trussTags",
    method: "post",
    data: query,
  });
};
//修改标签
export const editTag = (query) => {
  return request({
    url: "/apiAdmin/api/trussTags",
    method: "put",
    data: query,
  });
};
//删除标签
export const deleteTag = (query) => {
  return request({
    url: "/apiAdmin/api/trussTags",
    method: "delete",
    params: query,
  });
};
//标签批量处理
export const batchTag = (query) => {
  return request({
    url: "/apiAdmin/api/trussTags/batchProcessing",
    method: "post",
    params: query,
  });
};

// 获取项目列表
export const getProjectList = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjects/page",
    method: "get",
    params: query,
  });
};
// 获取项目详情
export const getProjectInfo = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjects/" + query.id,
    method: "get",
  });
};
//添加项目
export const addProject = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjects",
    method: "post",
    data: query,
  });
};
//修改项目
export const editProject = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjects",
    method: "put",
    data: query,
  });
};
//删除项目
export const deleteProject = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjects",
    method: "delete",
    params: query,
  });
};
//项目文件上传
export const projectUploadFile = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjects/uploadFile",
    method: "post",
    data: query,
    // method: 'post',
    // data: query
    isUploadFile: true,
  });
};

// 获取项目设备列表
export const getProjectDeviceList = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/page",
    method: "get",
    params: query,
  });
};
// 获取项目设备详情
export const getProjectDeviceInfo = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/" + query.id,
    method: "get",
  });
};
//修改项目设备
export const editProjectDevice = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices",
    method: "put",
    data: query,
  });
};

//批量开始采集
export const batchStartGather = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/batchStart",
    method: "post",
    params: query,
  });
};
//批量停止采集
export const batchStopGather = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/batchStop",
    method: "post",
    params: query,
  });
};
//全部开始采集
export const allStartGather = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/allStart",
    method: "post",
    params: query,
  });
};
//全部停止采集
export const allStopGather = (query) => {
  return request({
    url: "/apiAdmin/api/trussProjectsDevices/allStop",
    method: "post",
    params: query,
  });
};

// 获取用户列表
export const getAccountList = (query) => {
  return request({
    url: "/apiAdmin/v1/auth/accounts/employees",
    method: "get",
    params: query,
  });
};
// 获取用户详情
export const getAccountInfo = (query) => {
  return request({
    url: "/apiAdmin/v1/auth/accounts/employees/" + query.id,
    method: "get",
  });
};
//添加用户
export const addAccount = (query) => {
  return request({
    url: "/apiAdmin/v1/auth/accounts/employees/register",
    method: "post",
    data: query,
  });
};
//修改用户
export const editAccount = (query) => {
  return request({
    url: "/apiAdmin/v1/auth/accounts/employees/" + query.id,
    method: "put",
    data: query,
  });
};
//删除用户
export const deleteAccount = (query) => {
  return request({
    url: "/apiAdmin/v1/auth/accounts/employees/" + query.id,
    method: "delete",
    params: query,
  });
};

// 查看数据报告
export const getDataReport = (query) => {
  return request({
    url: "/apiAdmin/api/trussDataReport/select",
    method: "get",
    params: query,
  });
};
// 获取预警消息列表
export const getAlarmList = (query) => {
  return request({
    url: "/apiAdmin/api/trussWarningMsg/page",
    method: "get",
    params: query,
  });
};
//获取预警消息详情
export const getAlarmInfo = (query) => {
  return request({
    url: "/apiAdmin/api/trussWarningMsg/" + query.id,
    method: "get",
    params: query,
  });
};
//删除预警消息
export const deleteAlarmInfo = (query) => {
  return request({
    url: "/apiAdmin/api/trussWarningMsg",
    method: "delete",
    params: query,
  });
};
//预警消息已读
export const readAlarmInfo = (query) => {
  return request({
    url: "/apiAdmin/api/trussWarningMsg",
    method: "put",
    params: query,
  });
};
//查询报告总览
export const getOverview = (query) => {
  return request({
    url: "/apiAdmin/api/trussDataReport/overview",
    method: "get",
    params: query,
  });
};
//查询报告总览趋势
export const getOverviewTrend = (query) => {
  return request({
    url: "/apiAdmin/api/trussDataReport/trend",
    method: "get",
    params: query,
  });
};
//查询点位监测数据
export const getPointData = (query) => {
  return request({
    url: "/apiAdmin/api/trussDataReport/point",
    method: "get",
    params: query,
  });
};