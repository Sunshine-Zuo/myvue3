<template>
  <div class="dash">
    <div class="title">
      设备管理<span class="title-tip">所有设备都可以在此模块管理</span>
      <div class="button tag" @click="viewTag">
        <el-icon style="margin-right: 4px;">
          <PriceTag />
        </el-icon>标签管理
      </div>
    </div>
    <div class="wrap">
      <div class="toggle" @click="showTags = !showTags">
        <el-icon style="color: #888;font-size: 14px;" :style="toggleStyle">
          <ArrowDown />
        </el-icon>
      </div>

      <div class="tag-wrap">
        <template v-if="showTags">
          <div class="tag-label">标签筛选：</div>
          <div class="tags">
            <div class="tag-item" @click="current_tag = item" :class="[current_tag.id === item.id ? 'current' : '']"
              v-for="item in tags" :key="'tags' + item.id">{{
                item.name }}
            </div>
          </div>
        </template>
        <template v-else>
          <!-- <div class="tag-label">当前标签：</div>
          <div class="tags">
            <div class="tag-item current">{{ current_tag.name }}</div>
          </div> -->
          <div class="tag-label">标签筛选：</div>
          <div class="tags tags-col">
            <div class="tag-item" @click="current_tag = item" :class="[current_tag.id === item.id ? 'current' : '']"
              v-for="item in tags" :key="'tags-col' + item.id">{{
                item.name }}
            </div>
          </div>
        </template>
      </div>
      <div class="b-wrap">
        <el-select v-model="status1" class="m-2" placeholder="请选择在线状态" style="width: 160px">
          <el-option v-for="item in options_status1" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="status2" class="ml-20" placeholder="请选择采集状态" style="width: 160px">
          <el-option v-for="item in options_status2" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="status3" class="ml-20" placeholder="请选择绑定状态" style="width: 160px">
          <el-option v-for="item in options_status3" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div class="button current ml-20" @click="search">确定</div>
        <div class="button" @click="reset">重置</div>
      </div>
    </div>
    <div class="options-wrap">
      <div class="button" @click="batchDelete">批量删除</div>
      <div class="button" @click="handleBindBatch">批量绑定</div>
      <div class="flex-wrap">
        <div class="button current" @click="handleBindTag">
          <svg style="margin-right: 4px;" t="1695720515323" class="cursor-pointer" fill="currentcolor"
            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="750" width="16" height="20">
            <path
              d="M243.05728 399.36L332.65728 484.48l-161.664 160.192a149.568 149.568 0 0 0 0.32 214.08l1.92 1.92a153.024 153.024 0 0 0 211.776-2.176l172.864-171.264 89.728 85.248-172.864 171.264c-106.432 105.344-280.768 107.136-389.376 3.904l-3.52-3.392a268.8 268.8 0 0 1-0.576-384.832l161.664-160.192z m382.72-86.208l88.832 86.144-310.848 301.568-88.768-86.144L625.77728 313.152z m-75.52-232.96c106.368-105.344 280.704-107.136 389.312-3.904l3.52 3.392a268.8 268.8 0 0 1 0.576 384.832l-161.664 160.192-89.728-85.248 161.664-160.192a149.568 149.568 0 0 0-0.32-214.08l-1.92-1.92a153.024 153.024 0 0 0-211.776 2.176L467.05728 336.704 377.32928 251.52z"
              p-id="751"></path>
          </svg>整个套装绑定到
        </div>
        <div class="button current" @click="newDialogVisible = true">
          <el-icon style="margin-right: 4px;">
            <Plus />
          </el-icon>新增设备
        </div>
      </div>
    </div>
    <el-table :data="tableData" border stripe style="width: 100%;margin: 20px 0;min-height:calc(100vh - 450px);"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column align="center" type="index" label="编号" width="80" />
      <el-table-column align="center" prop="name" label="设备名称" min-width="160" />
      <el-table-column align="center" prop="uuid" label="设备序列号" min-width="160" />
      <el-table-column align="center" prop="type" label="设备类型" width="100" />
      <el-table-column align="center" label="最新绑定项目" min-width="160">
        <template #default="scope">
          <div>{{ scope.row.trussProjects?.name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="onlineStatus" label="在线状态" width="100">
        <template #default="scope">
          <div :class="[scope.row.onlineStatus === '在线' ? 'color-green' : 'color-red']">● {{ scope.row.onlineStatus }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据采集状态" width="120">
        <template #default="scope">
          <div>{{ scope.row.trussProjects?.collectStatus }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="剩余电量" width="100">
        <template #default="scope">
          <div :class="[parseFloat(scope.row.soc) < 40 ? 'color-red' : '']">{{
            parseFloat(scope.row.soc) >= 0 ? (scope.row.soc + '%') : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="purchaseTime" label="购买日期" width="120">
        <template #default="scope">
          <div>{{ scope.row.purchaseTime && scope.row.purchaseTime.split(' ')[0] }}</div>
          <div>{{ scope.row.purchaseTime && scope.row.purchaseTime.split(' ')[1] }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="120">
        <template #default="scope">
          <div>{{ scope.row.createTime && scope.row.createTime.split(' ')[0] }}</div>
          <div>{{ scope.row.createTime && scope.row.createTime.split(' ')[1] }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-icon class="cursor-pointer" title="查看详情" style="font-size: 20px;" @click="handleDetail(scope.row)">
            <View />
          </el-icon>
          <el-icon class="cursor-pointer" title="编辑" style="font-size: 20px;margin-left: 10px;"
            @click="handleEdit(scope.row)">
            <Edit />
          </el-icon>
          <!-- <el-icon class="cursor-pointer" v-if="!scope.row.trussProjects" title="设备绑定"
            style="font-size: 20px;margin-left: 10px;" @click="handleBind(scope.row)">
            <Link />
          </el-icon> -->
          <span title="设备绑定"><svg v-if="!scope.row.trussProjects" @click="handleBind(scope.row)"
              style="margin-left: 10px;" t="1695720515323" class="cursor-pointer" fill="currentcolor"
              viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="750" width="16" height="20">
              <path
                d="M243.05728 399.36L332.65728 484.48l-161.664 160.192a149.568 149.568 0 0 0 0.32 214.08l1.92 1.92a153.024 153.024 0 0 0 211.776-2.176l172.864-171.264 89.728 85.248-172.864 171.264c-106.432 105.344-280.768 107.136-389.376 3.904l-3.52-3.392a268.8 268.8 0 0 1-0.576-384.832l161.664-160.192z m382.72-86.208l88.832 86.144-310.848 301.568-88.768-86.144L625.77728 313.152z m-75.52-232.96c106.368-105.344 280.704-107.136 389.312-3.904l3.52 3.392a268.8 268.8 0 0 1 0.576 384.832l-161.664 160.192-89.728-85.248 161.664-160.192a149.568 149.568 0 0 0-0.32-214.08l-1.92-1.92a153.024 153.024 0 0 0-211.776 2.176L467.05728 336.704 377.32928 251.52z"
                p-id="751"></path>
            </svg></span>

          <el-icon v-if="!scope.row.trussProjects" class="cursor-pointer" title="删除"
            style="font-size: 20px;margin-left: 10px;color: #f44040;" @click="handleDelete(scope.row)">
            <Delete />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    <el-dialog v-model="newDialogVisible" title="批量添加设备" width="30%" center>
      <el-input v-model="deviceIds" @input="deviceIds = deviceIds.replace(/\s*/g, '')" :rows="5" type="textarea"
        placeholder="请输入需要同步的设备的设备序列号，以英文逗号分隔，如'NVR00141,NVR00142'" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="newDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreate">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getDeviceList, addDevice, getTagList, deleteDevice } from "@/utils/api.js";
import { Edit, Lock, Unlock, View, Delete, Setting, PriceTag, Link, Plus, EditPen, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from "element-plus";
const router = useRouter();
let currentPage = ref(1)
let pageSize = ref(50)
let total = ref(0)
// onMounted(() => {
//   _getTagList()
//   _getDeviceList()
// })
onActivated(() => {
  _getTagList()
  _getDeviceList()
})
const _getTagList = () => {
  getTagList().then(res => {
    if (res.code == 200) {
      tags.value = [{ id: '', name: '全部设备' }, ...res.data.rows]
      if (current_tag.value.name) {
        let t = tags.value.find(e => {
          return e.id == current_tag.value.id
        })
        current_tag.value = t
      } else {
        current_tag.value = tags.value[0]
      }
    }
  })
}
const _getDeviceList = () => {
  let data = {
    tId: current_tag.value.id,
    onlineStatus: status1.value,
    collectStatus: status2.value,
    bdStatus: status3.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value
  }
  getDeviceList(data).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows
      total.value = res.data.total
    }
  })
}
const search = () => {
  currentPage.value = 1
  _getDeviceList()
}
const reset = () => {
  pageSize.value = 50
  currentPage.value = 1
  status1.value = ''
  status2.value = ''
  status3.value = ''
  _getDeviceList()
}
const toggleStyle = computed(() => {
  return showTags.value ? { transform: 'rotate(180deg)' } : {}
});
let showTags = ref(false)
let current_tag = ref({})
let tags = ref([])
watch(current_tag, (val) => {
  pageSize.value = 50
  currentPage.value = 1
  _getDeviceList()
}, { immediate: false })

let options_status1 = ref([
  { value: '', label: '全部在线状态' },
  { value: '1', label: '在线设备' },
  { value: '0', label: '离线设备' },
])
let status1 = ref('')
let options_status2 = ref([
  { value: '', label: '全部采集状态' },
  { value: '1', label: '采集中' },
  { value: '0', label: '未采集' },
])
let status2 = ref('')
let options_status3 = ref([
  { value: '', label: '全部绑定状态' },
  { value: '1', label: '已绑定' },
  { value: '0', label: '未绑定' },
])
let status3 = ref('')

const handleSizeChange = (val) => {
  pageSize.value = val
  _getDeviceList()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  _getDeviceList()
}
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
let tableData = ref([])

const handleEdit = (row) => {
  router.push({ path: '/editdevice', query: { id: row.id } })
}
const handleDetail = (row) => {
  router.push({ path: '/devicedetail', query: { id: row.id } })
}
const handleBind = (row) => {
  router.push({ path: '/devicebinding', query: { id: row.id } })
}
const handleBindBatch = () => {
  if (!multipleSelection.value.length > 0) {
    ElMessage.error("请选择设备");
    return
  }
  ElMessageBox.confirm(
    '批量绑定时，已绑定项目的设备将被跳过，确认继续绑定',
    '提示').then(() => {
      let dids = multipleSelection.value.map(e => {
        return e.id
      })
      router.push({ path: '/devicebindingbatch', query: { dids: dids.join(','), text: multipleSelection.value[0].name } })
    })
}
const handleBindTag = () => {
  if (!current_tag.value.id) {
    ElMessage.error("请选择套件标签");
    return
  }
  router.push({ path: '/devicebindingbatch', query: { tid: current_tag.value.id, text: current_tag.value.name } })
}
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确认删除设备?',
    '提示').then(() => {
      _deleteDevice(row.id)
    })
}
const batchDelete = () => {
  if (!multipleSelection.value.length > 0) {
    ElMessage.error("请选择设备");
    return
  }
  ElMessageBox.confirm(
    '已选' + multipleSelection.value.length + '个设备，确认删除?',
    '提示').then(() => {
      let ids = multipleSelection.value.map(e => {
        return e.id
      })
      _deleteDevice(ids.join(','))
    })
}
const _deleteDevice = (ids) => {
  deleteDevice({ ids: ids }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getDeviceList()
    }
  })
}
const viewTag = () => {
  router.push({ path: '/managetag' })
}

let newDialogVisible = ref(false)
let deviceIds = ref('')
const handleCreate = () => {
  if (!deviceIds.value) {
    ElMessage.error("请输入设备序列号");
    return
  }
  addDevice({ uuids: deviceIds.value }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      newDialogVisible.value = false
      _getDeviceList()
    }
  })
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
  position: relative;

  .title-tip {
    color: #aaa;
    font-size: 14px;
    font-weight: normal;
    margin-left: 20px;
  }

  .tag {
    background-color: #000;
    color: #fff;
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    font-weight: normal;
  }
}

.wrap {
  margin: 0 10px 0 0;
  padding: 0 20px 20px;
  background-color: #eee;
  position: relative;

  .toggle {
    position: absolute;
    border: solid 1px #888;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }

  .tag-wrap {
    display: flex;
    align-items: center;
    border-bottom: solid 1px #ddd;
    padding: 20px 0;

    .tag-label {
      width: 90px;
    }



    .tags {
      flex: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      min-height: 34px;

      &.tags-col {
        height: 34px;
        overflow: hidden;
      }

      .tag-item {
        box-sizing: border-box;
        padding: 4px 10px;
        margin: 2px;
        cursor: pointer;

        &.current,
        &:hover {
          background-color: #000;
          color: #fff;
        }
      }
    }
  }

  .b-wrap {
    display: flex;
    align-items: center;
    padding-top: 20px;
  }
}

.options-wrap {
  display: flex;
  margin-top: 20px;

  .flex-wrap {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
}
</style>