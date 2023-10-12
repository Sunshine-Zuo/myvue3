<template>
  <div class="dash">
    <div class="title">用户管理</div>
    <div class="main">
      <div class="left">
        <div class="subtitle">用户分组</div>
        <div @click="current_group = item" class="item" :class="{ 'current': item.id == current_group.id }"
          v-for="(item, index) in groups" :key="'group' + index">{{ item.name + '(' + item.count + '人)' }}</div>
        <div class="empty" v-if="groups.length == 0">用户分组空</div>
      </div>
      <div class="right">
        <div class="subtitle">{{ current_group.name }}</div>
        <div class="rightoptions">
          <div class="button" @click="addCompVisible = true"><el-icon>
              <Plus />
            </el-icon>新建分组</div>
          <div class="button" @click="handleAddUser"><el-icon>
              <Plus />
            </el-icon>添加用户</div>
        </div>
        <div class="buttons">
          <div class="button" @click="handleBatchEnable">批量启用</div>
          <div class="button" @click="handleBatchDisable">批量停用</div>
        </div>
        <el-table :data="tableData" stripe style="width: 100%;height:calc(100% - 180px);margin: 20px 0;"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column align="center" prop="name" label="名称" />
          <el-table-column align="center" prop="mobilePhone" label="手机号" />
          <el-table-column align="center" prop="email" label="邮箱" />
          <el-table-column align="center" prop="status" label="是否启用">
            <template #default="scope">
              <el-switch :before-change="() => beforeSwitchChange(scope.row)" v-model="scope.row.status" inline-prompt
                size="large" active-text="On" inactive-text="Off" active-value="正常" inactive-value="停用" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="80" fixed="right">
            <template #default="scope">
              <el-icon title="编辑" class="cursor-pointer" style="font-size: 20px;margin-left: 10px;"
                @click="handleEdit(scope.row)">
                <Edit />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog v-model="userDialogVisible" :title="userEditType === 'edit' ? '编辑用户' : '新增用户'" width="400px" top="20vh">
      <el-form ref="userFormRef" :model="userForm" status-icon :rules="userEditType === 'edit' ? userRules1 : userRules"
        label-width="100px">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="userForm.name" @input="userForm.name = userForm.name.replace(/\s*/g, '')"
            style="width: 360px" />
        </el-form-item>
        <el-form-item label="手机号：" prop="mobilePhone">
          <el-input v-model="userForm.mobilePhone"
            @input="userForm.mobilePhone = userForm.mobilePhone.replace(/\s*/g, '')" :disabled="userEditType === 'edit'"
            style="width: 360px" />
        </el-form-item>
        <el-form-item label="分组：" prop="companyId">
          <el-select v-model="userForm.companyId" class="m-2" placeholder="请选择分组" style="width: 360px">
            <el-option v-for="item in groups" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="userForm.email" @input="userForm.email = userForm.email.replace(/\s*/g, '')"
            style="width: 360px" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="userForm.password" @input="userForm.password = userForm.password.replace(/\s*/g, '')"
            style="width: 360px" />
        </el-form-item>
        <el-form-item label="确认密码：" @input="userForm.repassword = userForm.repassword.replace(/\s*/g, '')"
          prop="repassword">
          <el-input v-model="userForm.repassword" style="width: 360px" />
        </el-form-item>
      </el-form>
      <div class="dbuttons">
        <div @click="submitForm(userFormRef)" class="button black">确定</div>
        <div @click="userDialogVisible = false" class="button">取消</div>
      </div>
    </el-dialog>
    <el-dialog v-model="addCompVisible" title="新建分组" width="30%" center>
      <el-input v-model="compName" @input="compName = compName.replace(/\s*/g, '')" placeholder="请输入分组名称" maxlength="20"
        show-word-limit />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCompVisible = false">取消</el-button>
          <el-button type="primary" @click="doAddComp">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getAccountList, getCompTree, addCompTree, getUserList, addUser, editUser, batchEnableUser, getCurrentUserInfo } from "@/utils/api.js";
import { Plus, Edit } from '@element-plus/icons-vue'
import { validEmail, validPhone, enRsa } from '@/utils/util.js'
import { ElMessage, ElMessageBox } from "element-plus";

const store = useStore();
const router = useRouter();
let userinfo = computed(() => store.state.userinfo);
let currentPage = ref(1)
let pageSize = ref(50)
let total = ref(0)
let addCompVisible = ref(false)
let compName = ref('')

let groups = ref([])
let current_group = ref({})
let tableData = ref([])
const _getAccountList = () => {
  getAccountList({ pageNum: currentPage.value, pageSize: pageSize.value }).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows
      total.value = res.data.total
    }
  })
}
const _getCompTree = () => {
  getCompTree().then(res => {
    if (res.code == 200) {
      groups.value = res.data
      if (!current_group.value.id) {
        current_group.value = groups.value[0]
      }
    }
  })
}
const doAddComp = () => {
  if (!compName.value) {
    ElMessage.error("请输入分组名称");
    return
  }
  addCompTree({ name: compName.value }).then(res => {
    if (res.code == 200) {
      ElMessage.success("添加成功");
      _getCompTree()
    }
  })
}
const _batchEnableUser = (data) => {
  //data  参数 {uuidList:[],enable:true}
  batchEnableUser(data).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      _getUserList()
    }
  })
}
const _getUserList = () => {
  let data = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    companyId: current_group.value.id
  }
  getUserList(data).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows
      total.value = res.data.total
    }
  })
}
watch(current_group, (val) => {
  if (val && val.id) {
    currentPage.value = 1
    _getUserList()
  }
}, { immediate: true })
onMounted(() => {
  _getCompTree()
})
const handleAddUser = () => {
  userDialogVisible.value = true
  userEditType.value = 'new'
  userForm.value = {}
}

const handleSizeChange = (val) => {
  pageSize.value = val
  _getUserList()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  _getUserList()
}
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const handleEdit = (row) => {
  userForm.value = row
  userDialogVisible.value = true
  userEditType.value = 'edit'
}
const beforeSwitchChange = (row) => {
  _batchEnableUser({ uuidList: [row.uuid], enable: row.status === '正常' ? false : true })
  return false
}
const handleBatchEnable = () => {
  if (!multipleSelection.value.length > 0) {
    ElMessage.error("请勾选用户");
    return
  }
  ElMessageBox.confirm(
    '确认批量启用?',
    '提示').then(() => {
      let uuids = multipleSelection.value.map(e => {
        return e.uuid
      })
      _batchEnableUser({ uuidList: uuids, enable: true })
    })
}
const handleBatchDisable = () => {
  if (!multipleSelection.value.length > 0) {
    ElMessage.error("请勾选用户");
    return
  }
  ElMessageBox.confirm(
    '确认批量停用?',
    '提示').then(() => {
      let uuids = multipleSelection.value.map(e => {
        return e.uuid
      })
      _batchEnableUser({ uuidList: uuids, enable: false })
    })
}
let userDialogVisible = ref(false)
let userFormRef = ref(null)
const _validateName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入姓名'))
  } else {
    if (userForm.value.name !== '') {
      if (!userFormRef.value) return
      userFormRef.value.validateField('name', () => null)
    }
    callback()
  }
}
const _validEmail = (rule, value, callback) => {
  if (!value) {
    callback()
  } else if (!validEmail(value)) {
    callback(new Error('邮箱格式不正确'))
  } else {
    callback()
  }
}
const _validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!validPhone(value)) {
    callback(new Error('手机号格式不正确'))
  } else {
    callback()
  }
}
const _validRepassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入确认密码'))
  } else if (userForm.value.password !== value) {
    callback(new Error('确认密码与密码不一致'))
  } else {
    callback()
  }
}
const _validRepassword1 = (rule, value, callback) => {
  if (!value && !userForm.value.password) {
    callback()
  } else if (userForm.value.password !== value) {
    callback(new Error('确认密码与密码不一致'))
  } else {
    callback()
  }
}
const userRules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  mobilePhone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: _validPhone, trigger: 'blur' }],
  companyId: [{ required: true, message: '请选择分组', trigger: 'change' }],
  email: [{ validator: _validEmail, trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  repassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }, { validator: _validRepassword, trigger: 'blur' }],
})
const userRules1 = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  mobilePhone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: _validPhone, trigger: 'blur' }],
  companyId: [{ required: true, message: '请选择分组', trigger: 'blur' }],
  email: [{ validator: _validEmail, trigger: 'blur' }],
  repassword: [{ validator: _validRepassword1, trigger: 'blur' }],
})
let userForm = ref({})
let userEditType = ref('edit')//edit new 
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (userEditType.value === 'new') {
        let data = {
          name: userForm.value.name,
          mobilePhone: userForm.value.mobilePhone,
          account: userForm.value.mobilePhone,
          email: userForm.value.email,
          companyId: userForm.value.companyId,
          password: userForm.value.password
        }
        addUser(data).then(res => {
          if (res.code == 200) {
            ElMessage.success("添加成功");
            userDialogVisible.value = false
            _getCompTree()
            _getUserList()
          }
        })
      } else {
        let data = {
          uuid: userForm.value.uuid,
          name: userForm.value.name,
          email: userForm.value.email,
          companyId: userForm.value.companyId,
        }
        if (userForm.value.repassword) {
          data.password = userForm.value.password
        }
        editUser(data).then(async res => {
          if (res.code == 200) {
            ElMessage.success("编辑成功");
            userDialogVisible.value = false
            _getCompTree()
            _getUserList()
            if (data.uuid === userinfo.value.uuid) {
              let res1 = await getCurrentUserInfo()
              localStorage.setItem("userinfo", JSON.stringify(res1.data));
              store.commit("setUserinfo", res1.data);
            }
          }
        })
      }
    }
  })
}
</script>
<style lang='scss' scoped>
:deep(.el-table th.el-table__cell>.cell) {
  color: #000;
}

:deep(.el-table__inner-wrapper::before) {
  background-color: transparent;
}

.title {
  font-size: 24px;
  font-weight: bold;
  height: 30px;
  margin-bottom: 20px;
}

.main {
  border-radius: 4px;
  border: solid 1px #eee;
  height: calc(100vh - 160px);
  min-height: 600px;
  display: flex;

  .left {
    width: 240px;
    overflow-y: auto;

    .item {
      margin: 10px;
      padding: 8px 10px;
      border-radius: 4px;

      &.current {
        background-color: #eee;
      }
    }

    .empty {
      font-size: 14px;
      color: #aaa;
      text-align: center;
      margin-top: 40px;
    }
  }

  .right {
    border-left: solid 1px #eee;
    position: relative;
    width: calc(100% - 240px);

    .rightoptions {
      display: flex;
      align-items: center;
      position: absolute;
      right: 10px;
      top: 14px;

      .button {
        width: 140px;
      }
    }

    .buttons {
      display: flex;
      align-items: center;
      margin: 10px;

      .button {
        width: 120px;
      }
    }
  }
}

.subtitle {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.dbuttons {
  display: flex;
  justify-content: center;

  .button {
    width: 100px;

    &.black {
      background-color: #000;
      color: #fff;
    }
  }
}
</style>