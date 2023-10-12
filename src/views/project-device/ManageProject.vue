<template>
  <div class="dash">
    <div class="title">项目管理</div>
    <div class="wrap">
      <div class="button" :class="[projectStatus === '1' ? 'current' : '']" @click="projectStatus = '1'">进行中的项目</div>
      <div class="button" :class="[projectStatus === '0' ? 'current' : '']" @click="projectStatus = '0'">已结束的项目</div>
      <div class="button create" @click="handleCreate">
        <el-icon style="margin-right: 4px;">
          <Plus />
        </el-icon>新建项目
      </div>
    </div>
    <el-table :data="tableData" border stripe style="width: 100%;margin: 20px 0;min-height:calc(100vh - 280px);">
      <el-table-column align="center" prop="name" label="项目名称" min-width="160" />
      <el-table-column align="center" prop="id" label="项目编号" width="120" />
      <el-table-column align="center" label="项目地点" min-width="160">
        <template #default="scope">
          <div v-if="calcWholeAddress(scope.row)"><el-popover :width="300" :content="formatWholeAddress(scope.row)">
              <template #reference>
                <div>
                  {{ formatWholeAddress(scope.row).slice(0, 25) }}...
                </div>
              </template>
            </el-popover></div>
          <div v-else>{{ formatWholeAddress(scope.row) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="exhibitionTime" label="布展时间" width="120">
        <template #default="scope">
          <div>{{ scope.row.exhibitionTime && scope.row.exhibitionTime.split(' ')[0] }}</div>
          <div>{{ scope.row.exhibitionTime && scope.row.exhibitionTime.split(' ')[1] }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="startTime" label="开展时间" width="120">
        <template #default="scope">
          <div>{{ scope.row.startTime && scope.row.startTime.split(' ')[0] }}</div>
          <div>{{ scope.row.startTime && scope.row.startTime.split(' ')[1] }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="endTime" label="撤展时间" width="120">
        <template #default="scope">
          <div>{{ scope.row.endTime && scope.row.endTime.split(' ')[0] }}</div>
          <div>{{ scope.row.endTime && scope.row.endTime.split(' ')[1] }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预警接收人" min-width="160">
        <template #default="scope">
          <div v-if="calcWarningName(scope.row.warningName)">
            <el-popover placement="top" :width="300" :content="formatWarningName(scope.row.warningName)">
              <template #reference>
                <div>
                  {{ formatWarningName(scope.row.warningName).slice(0, 25) }}...
                </div>
              </template>
            </el-popover>
          </div>
          <div v-else>{{ formatWarningName(scope.row.warningName) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="projectStatus" label="状态" width="100" />
      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-icon title="编辑" v-if="projectStatus === '1'" class="cursor-pointer" style="font-size: 20px;"
            @click="handleEdit(scope.row)">
            <Edit />
          </el-icon>
          <el-icon v-if="scope.row.projectStatus === '正常'" title="终止项目" class="cursor-pointer"
            style="font-size: 20px;margin-left: 10px;" @click="handleLock(scope.row)">
            <Lock />
          </el-icon>
          <el-icon v-else title="启动项目" class="cursor-pointer" style="font-size: 20px;margin-left: 10px;"
            @click="handleLock(scope.row)">
            <Unlock />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
<script setup>
import { Edit, Lock, Unlock, Plus } from '@element-plus/icons-vue'
import { getProjectList, editProject } from "@/utils/api.js";
const router = useRouter();
onActivated(() => {
  _getProjectList()
})
let projectStatus = ref('1')
let currentPage = ref(1)
let pageSize = ref(50)
let total = ref(0)
watch(projectStatus, (val) => {
  pageSize.value = 50
  currentPage.value = 1
  _getProjectList()
}, { immediate: false })
const _getProjectList = () => {
  let data = {
    projectStatus: projectStatus.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value
  }
  getProjectList(data).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows
      total.value = res.data.total
    }
  })
}
const handleSizeChange = (val) => {
  pageSize.value = val
  _getProjectList()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  _getProjectList()
}
let tableData = ref([])
const handleCreate = () => {
  router.push({ path: '/createproject' })
}
const handleEdit = (row) => {
  router.push({ path: '/editproject', query: { id: row.id } })
}
const handleLock = (row) => {
  //0:已终止 1:正常
  editProject({ id: row.id, projectStatus: row.projectStatus === '正常' ? '0' : '1' }).then(() => {
    _getProjectList()
  }
  )

}
const formatWarningName = (name) => {
  if (!name) {
    return ''
  }
  let names = name.split(',')
  names = names.map(element => {
    return decodeURI(element)
  });
  return names.join(',')
}
const calcWarningName = (name) => {
  let names = formatWarningName(name)
  if (names && names.length > 24) {
    return true
  }
  return false
}
const formatWholeAddress = (row) => {
  if (!row) {
    return ''
  }
  let address = (row.province || '') + (row.city || '') + (row.address || '')
  return address
}
const calcWholeAddress = (row) => {
  let address = formatWholeAddress(row)
  if (address && address.length > 24) {
    return true
  }
  return false
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

  .create {
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: #000;
    color: #fff;
  }
}
</style>