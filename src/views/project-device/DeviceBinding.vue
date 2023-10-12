<template>
  <div class="dash">
    <div class="title">设备绑定</div>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="130px" class="demo-ruleForm">
      <el-form-item label="选择项目" prop="project">
        <el-select v-model="ruleForm.project" class="m-2" placeholder="请选择绑定的项目" style="width: 360px">
          <el-option v-for="item in options_project" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择设备" prop="id">
        <el-select v-model="ruleForm.id" disabled class="m-2" placeholder="请选择需要绑定的设备" style="width: 360px">
          <el-option v-for="item in options_device" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="在项目中的名称" prop="name">
        <el-input v-model="ruleForm.name" @input="ruleForm.name = ruleForm.name.replace(/\s*/g, '')" style="width: 360px"
          maxlength="12" show-word-limit />
      </el-form-item>
      <el-form-item label="设备序列号" prop="uuid">
        <el-input v-model="ruleForm.uuid" disabled style="width: 360px" />
      </el-form-item>
      <el-form-item label="设备类型" prop="type">
        <el-input v-model="ruleForm.type" disabled style="width: 360px" />
      </el-form-item>
      <!-- <el-form-item label="购买日期" prop="date1">
        <el-date-picker v-model="ruleForm.date1" format="YYYY-MM-DD HH:mm" type="datetime" placeholder="请选择时间"
          style="width: 360px" />
      </el-form-item> -->
      <el-form-item label="备注说明" prop="remarks">
        <el-input v-model="ruleForm.remarks" :rows="3" type="textarea" maxlength="120" placeholder="请输入备注说明"
          style="width: 360px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
        <!-- <el-button @click="resetForm(ruleFormRef)">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { getProjectList, getDeviceInfo, addDeviceBinding } from "@/utils/api.js";
import { ElMessage } from "element-plus";
const router = useRouter();
const route = useRoute();
const store = useStore();
const _getProjectList = () => {
  let data = {
    projectStatus: '1',
    pageNum: 1,
    pageSize: 9999
  }
  getProjectList(data).then(res => {
    if (res.code == 200) {
      options_project.value = res.data.rows
      // total.value = res.data.total
    }
  })
}
const _getDeviceInfo = () => {
  let deviceId = route.query.id
  getDeviceInfo({ id: deviceId }).then(res => {
    if (res.code == 200) {
      ruleForm.value = res.data
      options_device.value = [res.data]
    }
  })
}
onMounted(() => {
  _getProjectList()
  _getDeviceInfo()
})
const ruleFormRef = ref(null)
let options_project = ref([])
let options_device = ref([])
const rules = reactive({
  project: [{ required: true, message: '请选择项目', trigger: 'change' }],
  id: [{ required: true, message: '请选择设备', trigger: 'change' }],
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
})
let ruleForm = ref({})
const areaChange = (area) => {
  console.log('area', area);
}
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let data = {
        dids: [ruleForm.value.id],
        name: ruleForm.value.name,
        remarks: ruleForm.value.remarks,
        trussProjects: {
          id: ruleForm.value.project
        }
      }
      addDeviceBinding(data).then(res => {
        if (res.code == 200) {
          ElMessage.success("操作成功");
          router.push({ path: '/managedevice' })
        }
      })
    }
  })
}

</script>
<style lang='scss' scoped>
:deep(.el-input__wrapper) {
  width: 360px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  height: 30px;
  margin-bottom: 20px;
}
</style>