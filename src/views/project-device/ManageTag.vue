<template>
  <div class="dash">
    <div class="title">标签管理</div>
    <div class="wrap">
      <div class="button create" @click="handleCreate">
        <el-icon style="margin-right: 4px;">
          <Plus />
        </el-icon>新建标签
      </div>
    </div>
    <el-table :data="tableData" stripe style="width: 100%;margin: 20px 0;min-height:500px;">
      <el-table-column align="center" prop="name" label="标签名称" />
      <el-table-column align="center" label="设备数量">
        <template #default="scope">
          <div>{{ scope.row.trussDevicesList?.length || 0 }}个设备</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280" fixed="right">
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <div class="cursor-pointer" style="display: flex;align-items: center;" @click="handleManage(scope.row)">
              <el-icon title="管理设备" style="font-size: 16px;margin-right: 4px;">
                <Plus />
              </el-icon>
              <span>管理设备</span>
            </div>
            <div class="cursor-pointer" style="display: flex;align-items: center;margin-left: 20px;"
              @click="handleEdit(scope.row)">
              <el-icon title="修改名称" style="font-size: 16px;margin-right: 4px;">
                <Edit />
              </el-icon>
              <span>修改名称</span>
            </div>
            <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row)" confirm-button-text="确认"
              cancel-button-text="取消">
              <template #reference>
                <div class="cursor-pointer" style="display: flex;align-items: center;margin-left: 20px;color: #f44040;">
                  <el-icon title="删除" style="font-size: 16px;margin-right: 4px;">
                    <Delete />
                  </el-icon>
                  <span>删除</span>
                </div>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[20,50,100]"
      layout="total, sizes, prev, pager, next, jumper" :total="400" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" /> -->
    <el-dialog v-model="newDialogVisible" title="新建标签" width="30%" center>
      <el-input v-model="newtagName" @input="newtagName = newtagName.replace(/\s*/g, '')" placeholder="请输入标签名称"
        maxlength="8" show-word-limit />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="newDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="doCreate">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="editDialogVisible" title="修改名称" width="30%" center>
      <el-input v-model="tagName" @input="tagName = tagName.replace(/\s*/g, '')" placeholder="请输入标签名称" maxlength="8"
        show-word-limit />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="doEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="deviceDialogVisible" title="标签设备管理" width="500px" center>
      <div class="dialog-title">
        标准套件
      </div>
      <div class="tip">
        <span class="tip-left">选择对应的设备，勾选加入标签里</span>
        <span class="tip-right">(已选择{{ selectedDevice.length }}个设备)</span>
      </div>
      <div class="device-wrap">
        <el-checkbox-group v-model="selectedDevice">
          <el-checkbox v-for="item in deviceList" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deviceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDevice">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getTagList, editTag, addTag, deleteTag, batchTag, getDeviceList } from "@/utils/api.js";
import { Edit, Lock, Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage } from "element-plus";
const router = useRouter();
onMounted(() => {
  _getTagList()
  _getDeviceList()
})
const _getTagList = () => {
  getTagList({ pageSize: 999, pageNum: 1 }).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows
    }
  })
}
const _getDeviceList = () => {
  let data = {
    pageNum: 1,
    pageSize: 9999
  }
  getDeviceList(data).then(res => {
    if (res.code == 200) {
      deviceList.value = res.data.rows
    }
  })
}
let tableData = ref([])
let currentTag = ref({})//当前操作的套件

let deviceList = ref([])
let deviceDialogVisible = ref(false)
let selectedDevice = ref([])
const handleManage = (row) => {
  currentTag.value = row
  selectedDevice.value = currentTag.value.trussDevicesList.map(e => {
    return e.id
  })
  deviceDialogVisible.value = true
}
const submitDevice = () => {
  batchTag({ id: currentTag.value.id, ids: selectedDevice.value.join(',') }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      deviceDialogVisible.value = false
      _getTagList()
    }
  })
}

let editDialogVisible = ref(false)
let newtagName = ref('')
let tagName = ref('')
let newDialogVisible = ref(false)
const handleCreate = () => {
  newDialogVisible.value = true
}
const doCreate = () => {
  if (!newtagName.value) {
    ElMessage.error("请输入标签名称");
    return
  }
  addTag({ name: newtagName.value }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      newDialogVisible.value = false
      _getTagList()
    }
  })
}
const handleEdit = (row) => {
  currentTag.value = row
  editDialogVisible.value = true
}
const doEdit = () => {
  if (!tagName.value) {
    ElMessage.error("请输入标签名称");
    return
  }
  editTag({ id: currentTag.value.id, name: tagName.value }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      editDialogVisible.value = false
      _getTagList()
    }
  })
}
const handleDelete = (row) => {
  deleteTag({ ids: row.id }).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getTagList()
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
}

.wrap {
  display: flex;
  // border-bottom: solid 1px #ddd;

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

.dialog-title {
  font-size: 16px;
  color: #000;
  font-weight: bold;
  margin-bottom: 10px;
}

.tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #000;
  color: #fff;
  padding: 4px 10px;
  font-size: 14px;
}

.device-wrap {
  height: 280px;
  overflow-y: auto;
  border: solid 1px #ddd;
  padding: 10px;
}
</style>