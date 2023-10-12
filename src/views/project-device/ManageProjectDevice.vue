<template>
  <div class="dash">
    <div class="title">
      项目设备管理<span class="title-tip">已绑定在此项目下的设备</span>
      <div class="title-button-wrap">
        <div class="button start" v-show="canCaiji" @click="handleStartGatherAll">
          <el-icon style="font-size: 16px;margin-right: 2px;">
            <VideoPlay />
          </el-icon>开始采集数据
        </div>
        <div class="button stop" v-show="canCaiji" @click="handleStopGatherAll">
          <el-icon style="font-size: 16px;margin-right: 2px;">
            <CircleClose />
          </el-icon>停止采集数据
        </div>
        <div class="button alldevice" @click="toManageDevice">查看所有设备</div>
      </div>
    </div>
    <div class="wrap">
      <div class="button" @click="onlineStatus = '1'" :class="[onlineStatus === '1' ? 'current' : '']">在线的设备</div>
      <div class="button" @click="onlineStatus = '0'" :class="[onlineStatus === '0' ? 'current' : '']">离线的设备</div>
    </div>
    <div class="options-wrap">
      <div class="button" @click="handleStartGatherBatch" v-show="canCaiji">批量开始采集</div>
      <div class="button" @click="handleStopGatherBatch" v-show="canCaiji">批量停止采集</div>
      <div class="button" @click="handleStartUseBatch">批量绑定设备</div>
      <div class="button" @click="handleStopUseBatch">批量解绑设备</div>
      <div class="button current allres" @click="handleStopUseProject">
        <svg style="margin-right: 4px;" t="1695721461776" fill="currentcolor" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="1204" width="16" height="20">
          <path
            d="M358.656 482.688L180.48 660.864l-6.72 7.232a132.032 132.032 0 0 0 186.176 186.112l7.232-6.656 178.176-178.24 90.496 90.56-178.176 178.176-9.408 8.96a260.032 260.032 0 0 1-367.232-367.232l8.96-9.408L268.16 392.128l90.496 90.56z m353.92 377.28l33.088 123.648-123.648 33.088-33.088-123.584 123.648-33.152zM166.208 310.4l-33.152 123.648-123.648-33.152 33.152-123.584 123.648 33.088z m817.92 582.72l-90.56 90.496-180.992-181.056 90.496-90.496 180.992 181.056zM313.984 219.904L223.616 310.4 42.56 129.408 133.056 38.912l181.056 180.992z m609.28-115.2a260.032 260.032 0 0 1 8.96 358.272l-8.96 9.408-178.24 178.24-90.496-90.56 178.176-178.176a132.032 132.032 0 0 0-179.456-193.408l-7.232 6.72-178.176 178.176L377.408 282.88l178.176-178.176a259.968 259.968 0 0 1 367.68 0z m93.888 516.864l-33.152 123.648-123.648-33.152 33.152-123.648 123.648 33.152zM404.608 5.76l33.088 123.648-123.584 33.088L280.96 38.912 404.608 5.76z"
            p-id="1205"></path>
        </svg>项目设备全部解绑
      </div>
    </div>
    <el-table :data="tableData" border stripe style="width: 100%;margin: 20px 0;min-height:calc(100vh - 330px);"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column align="center" type="index" label="编号" width="80" />
      <el-table-column align="center" prop="name" label="设备名称" min-width="160">
        <template #default="scope">
          <div>{{ scope.row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="uuid" label="设备序列号" min-width="160">
        <template #default="scope">
          <div>{{ scope.row.trussDevices?.uuid }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="设备类型" width="100">
        <template #default="scope">
          <div>{{ scope.row.trussDevices?.type }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="bdStatus" label="与当前项目绑定状态" min-width="120">
        <template #default="scope">
          <div :class="[scope.row.bdStatus === '已绑定' ? 'color-green' : 'color-red']">{{ scope.row.bdStatus }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="onlineStatus" label="在线状态" width="100">
        <template #default="scope">
          <div :class="[scope.row.trussDevices?.onlineStatus === '在线' ? 'color-green' : 'color-red']">● {{
            scope.row.trussDevices?.onlineStatus }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="collectStatus" label="数据采集状态" width="120" />
      <el-table-column align="center" label="剩余电量" width="100">
        <template #default="scope">
          <div :class="[parseFloat(scope.row.trussDevices?.soc) < 40 ? 'color-red' : '']">{{
            parseFloat(scope.row.trussDevices?.soc) >= 0 ? (scope.row.trussDevices?.soc + '%') : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="purchaseTime" label="购买日期" width="120">
        <template #default="scope">
          <div>{{ scope.row.trussDevices && scope.row.trussDevices.purchaseTime &&
            scope.row.trussDevices.purchaseTime.split(' ')[0] }}</div>
          <div>{{ scope.row.trussDevices && scope.row.trussDevices.purchaseTime &&
            scope.row.trussDevices.purchaseTime.split(' ')[1] }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="120">
        <template #default="scope">
          <div>{{ scope.row.trussDevices && scope.row.trussDevices.createTime &&
            scope.row.trussDevices.createTime.split(' ')[0] }}</div>
          <div>{{ scope.row.trussDevices && scope.row.trussDevices.createTime &&
            scope.row.trussDevices.createTime.split(' ')[1] }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="190" fixed="right">
        <template #default="scope">
          <el-icon title="查看详情" class="cursor-pointer" style="font-size: 20px;" @click="handleDetail(scope.row)">
            <View />
          </el-icon>
          <el-icon title="编辑" class="cursor-pointer" style="font-size: 20px;margin-left: 10px;"
            @click="handleEdit(scope.row)">
            <Edit />
          </el-icon>
          <el-icon title="预警设置" class="cursor-pointer" style="font-size: 20px;margin-left: 10px;"
            @click="handleAlarm(scope.row)">
            <Bell />
          </el-icon>
          <el-icon title="开始采集" v-if="scope.row.collectStatus !== '采集中' && canCaiji" class="cursor-pointer"
            style="font-size: 20px;margin-left: 10px;" @click="handleStartGather(scope.row)">
            <VideoPlay />
          </el-icon>
          <el-icon title="停止采集" v-if="scope.row.collectStatus === '采集中' && canCaiji" class="cursor-pointer"
            style="font-size: 20px;margin-left: 10px;" @click="handleStopGather(scope.row)">
            <CircleClose />
          </el-icon>
          <!-- <el-icon title="解绑设备" v-if="scope.row.bdStatus === '已绑定'" class="cursor-pointer"
            style="font-size: 20px;margin-left: 10px;" @click="handleStartUse(scope.row)">
            <Unlock />
          </el-icon>
          <el-icon title="绑定设备" v-if="scope.row.bdStatus !== '已绑定'" class="cursor-pointer"
            style="font-size: 20px;margin-left: 10px;" @click="handleStopUse(scope.row)">
            <Lock />
          </el-icon> -->
          <span title="解绑设备"><svg v-if="scope.row.bdStatus === '已绑定'" @click="handleStopUse(scope.row)"
              style="margin-left: 10px;" t="1695721461776" class="cursor-pointer" fill="currentcolor"
              viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1204" width="16" height="20">
              <path
                d="M358.656 482.688L180.48 660.864l-6.72 7.232a132.032 132.032 0 0 0 186.176 186.112l7.232-6.656 178.176-178.24 90.496 90.56-178.176 178.176-9.408 8.96a260.032 260.032 0 0 1-367.232-367.232l8.96-9.408L268.16 392.128l90.496 90.56z m353.92 377.28l33.088 123.648-123.648 33.088-33.088-123.584 123.648-33.152zM166.208 310.4l-33.152 123.648-123.648-33.152 33.152-123.584 123.648 33.088z m817.92 582.72l-90.56 90.496-180.992-181.056 90.496-90.496 180.992 181.056zM313.984 219.904L223.616 310.4 42.56 129.408 133.056 38.912l181.056 180.992z m609.28-115.2a260.032 260.032 0 0 1 8.96 358.272l-8.96 9.408-178.24 178.24-90.496-90.56 178.176-178.176a132.032 132.032 0 0 0-179.456-193.408l-7.232 6.72-178.176 178.176L377.408 282.88l178.176-178.176a259.968 259.968 0 0 1 367.68 0z m93.888 516.864l-33.152 123.648-123.648-33.152 33.152-123.648 123.648 33.152zM404.608 5.76l33.088 123.648-123.584 33.088L280.96 38.912 404.608 5.76z"
                p-id="1205"></path>
            </svg></span>
          <span title="绑定设备"><svg v-if="scope.row.bdStatus !== '已绑定'" @click="handleStartUse(scope.row)"
              style="margin-left: 10px;" t="1695720515323" class="cursor-pointer" fill="currentcolor"
              viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="750" width="16" height="20">
              <path
                d="M243.05728 399.36L332.65728 484.48l-161.664 160.192a149.568 149.568 0 0 0 0.32 214.08l1.92 1.92a153.024 153.024 0 0 0 211.776-2.176l172.864-171.264 89.728 85.248-172.864 171.264c-106.432 105.344-280.768 107.136-389.376 3.904l-3.52-3.392a268.8 268.8 0 0 1-0.576-384.832l161.664-160.192z m382.72-86.208l88.832 86.144-310.848 301.568-88.768-86.144L625.77728 313.152z m-75.52-232.96c106.368-105.344 280.704-107.136 389.312-3.904l3.52 3.392a268.8 268.8 0 0 1 0.576 384.832l-161.664 160.192-89.728-85.248 161.664-160.192a149.568 149.568 0 0 0-0.32-214.08l-1.92-1.92a153.024 153.024 0 0 0-211.776 2.176L467.05728 336.704 377.32928 251.52z"
                p-id="751"></path>
            </svg></span>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    <el-dialog v-model="editDialogVisible" title="修改名称" width="30%" center>
      <el-input v-model="newName" @input="newName = newName.replace(/\s*/g, '')" placeholder="请输入设备名称" maxlength="20"
        show-word-limit />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="doEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { Edit, Lock, Unlock, View, Bell, VideoPlay, CircleClose, FolderChecked, FolderDelete, CaretRight, Close } from '@element-plus/icons-vue'
import { getProjectDeviceList, editProjectDevice, batchStartGather, batchStopGather, allStartGather, allStopGather, startUseBatch, stopUseBatch, stopUseProject } from "@/utils/api.js";
import { ElMessage, ElMessageBox } from "element-plus";
const store = useStore();
const router = useRouter();
let currentPage = ref(1)
let pageSize = ref(50)
let total = ref(0)
onMounted(() => {
})
let onlineStatus = ref('1')//1在线 0离线
const currentProject = computed(() => store.state.currentProject);
const userinfo = computed(() => store.state.userinfo);
const canCaiji = computed(() => {
  //只有是项目负责人才能操作是否采集
  if (currentProject.value && currentProject.value.responsibleIds) {
    let ids = currentProject.value.responsibleIds.split(",")
    if (ids.includes(userinfo.value.id)) {
      return true
    }
  }
  return false
})
const _getProjectDeviceList = () => {
  let data = {
    pid: currentProject.value.id,
    status: onlineStatus.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value
  }
  getProjectDeviceList(data).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows
      total.value = res.data.total
    }
  })
}
watch(currentProject, (val) => {
  if (val && val.id) {
    _getProjectDeviceList()
  }
}, { immediate: true })
watch(onlineStatus, (val) => {
  pageSize.value = 50
  currentPage.value = 1
  _getProjectDeviceList()
}, { immediate: false })
const handleSizeChange = (val) => {
  pageSize.value = val
  _getProjectDeviceList()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  _getProjectDeviceList()
}
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
let tableData = ref([])
let currentRow = ref({})

let editDialogVisible = ref(false)
const handleEdit = (row) => {
  currentRow.value = row
  editDialogVisible.value = true
}
let newName = ref('')
const doEdit = () => {
  if (!newName.value) {
    ElMessage.error("请输入设备名称");
    return
  }
  let data = {
    id: currentRow.value.id,
    name: newName.value
  }
  editProjectDevice(data).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      editDialogVisible.value = false
      _getProjectDeviceList()
    }
  })
}
const handleDetail = (row) => {
  router.push({ path: '/projectdevicedetail', query: { id: row.id } })
}
const handleAlarm = (row) => {
  router.push({ path: '/alarmsetting', query: { id: row.id } })
}

const _allStartGather = () => {
  allStartGather({ pid: currentProject.value.id }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getProjectDeviceList()
    }
  })
}
const _allStopGather = () => {
  allStopGather({ pid: currentProject.value.id }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getProjectDeviceList()
    }
  })
}
const _batchStartGather = (ids) => {
  batchStartGather({ pid: currentProject.value.id, ids: ids }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getProjectDeviceList()
    }
  })
}
const _batchStopGather = (ids) => {
  batchStopGather({ pid: currentProject.value.id, ids: ids }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getProjectDeviceList()
    }
  })
}
const handleStartGather = (row) => {
  currentRow.value = row
  ElMessageBox.confirm(
    '确认开始采集?',
    '提示').then(() => {
      _batchStartGather(row.id)
    })
}
const handleStopGather = (row) => {
  currentRow.value = row
  ElMessageBox.confirm(
    '确认停止采集?',
    '提示').then(() => {
      _batchStopGather(row.id)
    })
}
const handleStartGatherBatch = () => {
  if (!multipleSelection.value.length > 0) {
    ElMessage.error("请勾选项目设备");
    return
  }
  ElMessageBox.confirm(
    '确认批量开始采集?',
    '提示').then(() => {
      let ids = multipleSelection.value.map(e => {
        return e.id
      })
      _batchStartGather(ids.join(','))
    })
}
const handleStopGatherBatch = () => {
  if (!multipleSelection.value.length > 0) {
    ElMessage.error("请勾选项目设备");
    return
  }
  ElMessageBox.confirm(
    '确认批量停止采集?',
    '提示').then(() => {
      let ids = multipleSelection.value.map(e => {
        return e.id
      })
      _batchStopGather(ids.join(','))
    })
}
const handleStartGatherAll = () => {
  ElMessageBox.confirm(
    '此操作将作用于当前项目下的所有设备，确认开始采集?',
    '提示').then(() => {
      _allStartGather()
    })
}
const handleStopGatherAll = () => {
  ElMessageBox.confirm(
    '此操作将作用于当前项目下的所有设备，确认停止采集?',
    '提示').then(() => {
      _allStopGather()
    })
}
const handleStartUse = (row) => {
  startUseBatch({ ids: row.id }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getProjectDeviceList()
    } else {
      if (res.message) {
        ElMessage.error(res.message);
      }
    }
  })
}
const handleStopUse = (row) => {
  stopUseBatch({ ids: row.id }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getProjectDeviceList()
    } else {
      if (res.message) {
        ElMessage.error(res.message);
      }
    }
  })
}
const handleStartUseBatch = () => {
  if (!multipleSelection.value.length > 0) {
    ElMessage.error("请勾选项目设备");
    return
  }
  let ids = multipleSelection.value.map(e => {
    return e.id
  })
  startUseBatch({ ids: ids.join(',') }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getProjectDeviceList()
    }
  })
}
const handleStopUseBatch = () => {
  if (!multipleSelection.value.length > 0) {
    ElMessage.error("请勾选项目设备");
    return
  }
  let ids = multipleSelection.value.map(e => {
    return e.id
  })
  stopUseBatch({ ids: ids.join(',') }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getProjectDeviceList()
    }
  })
}
const _stopUseProject = () => {
  stopUseProject({ pid: currentProject.value.id }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getProjectDeviceList()
    }
  })
}
const handleStopUseProject = () => {
  ElMessageBox.confirm(
    '确认将当前项目中的所有设备全部解绑?',
    '提示').then(() => {
      _stopUseProject()
    })
}
const toManageDevice = () => {
  router.push({ path: '/managedevice' })
}
</script>
<style lang='scss' scoped>
:deep(.el-table th.el-table__cell>.cell) {
  color: #000;
}

.title {
  font-size: 24px;
  font-weight: bold;
  height: 30px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  .title-tip {
    color: #aaa;
    font-size: 14px;
    font-weight: normal;
    margin-left: 20px;
  }

  .title-button-wrap {
    flex: 1;
    position: relative;
    font-size: 16px;
    font-weight: normal;
    display: flex;
    top: 10px;
    margin-left: 30px;

    .start {
      background-color: #3b6df2;
      border-radius: 30px;
      color: #fff;
    }

    .stop {
      background-color: #f00000;
      border-radius: 30px;
      color: #fff;
    }

    .alldevice {
      position: absolute;
      right: 10px;
      background-color: #000;
      color: #fff;
    }
  }
}

.wrap {
  display: flex;
  border-bottom: solid 1px #ddd;

  .button {
    position: relative;
    bottom: -1px;
  }
}

.options-wrap {
  display: flex;
  margin-top: 20px;
  position: relative;

  .allres {
    position: absolute;
    right: 10px;
  }
}
</style>