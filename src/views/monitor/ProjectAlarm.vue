<template>
  <div class="dash">
    <div class="title">项目异常预警</div>
    <div class="wrap">
      <div class="button" :class="[reading == '0' ? 'current' : '']" @click="changeReading('0')">未读预警消息</div>
      <div class="button" :class="[reading == '1' ? 'current' : '']" @click="changeReading('1')">已读预警消息</div>
    </div>
    <div class="options-wrap">
      <div class="button" @click="handleDeleteBatch">批量删除</div>
      <div class="button" v-if="reading == '0'" @click="handleReadingBatch">批量标为已读</div>
    </div>
    <el-table :data="tableData" border stripe style="width: 100%;margin: 20px 0;min-height:calc(100vh - 330px);"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column align="center" type="index" label="编号" width="80" />
      <el-table-column align="center" prop="content" label="预警内容" width="240">
        <template #default="scope">
          <div v-html="scope.row.msg"></div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deviceName" label="设备名称" min-width="120">
        <template #default="scope">
          <div>{{ scope.row.trussProjectsDevices && scope.row.trussProjectsDevices.name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deviceId" label="设备序列号" min-width="120">
        <template #default="scope">
          <div>{{ scope.row.trussDevices && scope.row.trussDevices.uuid }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deviceType" label="设备类型" width="100">
        <template #default="scope">
          <div>{{ scope.row.trussDevices && scope.row.trussDevices.type }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="project" label="所属项目" min-width="160">
        <template #default="scope">
          <div>{{ scope.row.trussProjects && scope.row.trussProjects.name }}</div>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="status" label="在线状态" width="100">
        <template #default="scope">
          <div
            :class="[scope.row.trussDevices && scope.row.trussDevices.onlineStatus === '在线' ? 'color-green' : 'color-red']">
            ● {{ scope.row.trussDevices &&
              scope.row.trussDevices.onlineStatus }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="120">
        <template #default="scope">
          <div>{{ scope.row.createTime && scope.row.createTime.split(' ')[0] }}</div>
          <div>{{ scope.row.createTime && scope.row.createTime.split(' ')[1] }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-icon title="查看详情" class="cursor-pointer" style="font-size: 20px;" @click="handleDetail(scope.row)">
            <View />
          </el-icon>
          <el-icon title="删除" class="cursor-pointer" style="font-size: 20px;margin-left: 10px;"
            @click="handleDelete(scope.row)">
            <Delete />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    <el-dialog v-model="dialogVisible" title="预警详情" width="400px" top="25vh" :before-close="handleClose">
      <div class="alarm-info">
        <div class="aitem mt-10">
          <div class="label">设备：</div>
          <div class="text">{{ current_row.trussProjectsDevices?.name }}</div>
        </div>
        <div class="aitem mt-10">
          <div class="label">设备类型：</div>
          <div class="text">{{ current_row.trussDevices?.type }}</div>
        </div>
        <div class="aitem mt-10">
          <div class="label">创建时间：</div>
          <div class="text">{{ current_row.createTime }}</div>
        </div>
        <div class="label mt-10">预警信息：</div>
        <div class="info mt-10 copy-text" v-html="current_row.msg"></div>
        <div class="copy button mt-20" v-if="copyed" @click="doCopy">
          <el-icon style="color: #2a7865;margin-right: 4px;font-size: 18px;">
            <CircleCheck />
          </el-icon>
          复制成功!
        </div>
        <div class="copy button mt-20" v-else @click="doCopy">一键复制</div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import copy from 'copy-to-clipboard';
import { ElMessage, ElMessageBox } from "element-plus";
import { View, Delete, CircleCheck } from '@element-plus/icons-vue'
import { getAlarmList, deleteAlarmInfo, readAlarmInfo } from "@/utils/api.js";

const router = useRouter();
const store = useStore();
const currentProject = computed(() => store.state.currentProject);
let currentPage = ref(1)
let pageSize = ref(50)
let total = ref(0)
let current_row = ref({})
let reading = ref('0')
let tableData = ref([])
const changeReading = (n) => {
  currentPage.value = 1
  reading.value = n
  _getAlarmList()
}
const _getAlarmList = () => {
  let data = {
    pageSize: pageSize.value,
    pageNum: currentPage.value,
    reading: reading.value,
    pid: currentProject.value.id
  }
  getAlarmList(data).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows
      total.value = res.data.total
    }
  })
}
watch(currentProject, (val) => {
  if (val && val.id) {
    _getAlarmList()
  }
}, { immediate: true })
const _readAlarmInfo = () => {
  let ids = multipleSelection.value.map(e => {
    return e.id
  })
  readAlarmInfo({ ids: ids.join(',') }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getAlarmList()
    }
  })
}
const _deleteAlarmInfo = (ids) => {
  deleteAlarmInfo({ ids: ids }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getAlarmList()
    }
  })
}
onMounted(() => { })
const handleSizeChange = (val) => {
  pageSize.value = val
  _getAlarmList()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  _getAlarmList()
}
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const handleDetail = (row) => {
  current_row.value = row
  dialogVisible.value = true
}

const handleDelete = (row) => {
  current_row.value = row
  ElMessageBox.confirm(
    '确认删除预警消息？',
    '提示').then(() => {
      _deleteAlarmInfo(row.id)
    })
}
const handleDeleteBatch = () => {
  if (multipleSelection.value.length < 1) {
    ElMessage.error("请勾选预警消息");
    return
  }
  ElMessageBox.confirm(
    '确认批量删除预警消息？',
    '提示').then(() => {
      let ids = multipleSelection.value.map(e => {
        return e.id
      })
      _deleteAlarmInfo(ids.join(','))
    })
}
const handleReadingBatch = () => {
  if (multipleSelection.value.length < 1) {
    ElMessage.error("请勾选预警消息");
    return
  }
  _readAlarmInfo()
}

let copyed = ref(false)
let dialogVisible = ref(false)
const handleClose = () => {
  dialogVisible.value = false
  copyed.value = false
}
const doCopy = () => {
  let txt = `设备：${current_row.value.trussDevices?.name}
   设备类型：${current_row.value.trussDevices?.type}
   创建时间：${current_row.value.createTime}
   预警信息：
   ${document.querySelector('.copy-text').innerText}`
  copy(txt);
  copyed.value = true
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
}

.alarm-info {
  position: relative;
  font-size: 14px;

  .aitem {
    display: flex;
    align-items: center;
  }

  .label {
    color: #aaa;
  }

  .text {}

  .info {
    background-color: #eee;
    padding: 10px;
    // color: #f22b27;
  }

  .copy {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>