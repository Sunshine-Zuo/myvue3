<template>
  <div class="dash">
    <div class="title">设备批量绑定</div>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="130px" class="demo-ruleForm">
      <el-form-item label="选择项目" prop="project">
        <el-select v-model="ruleForm.project" class="m-2" placeholder="请选择绑定的项目" style="width: 360px">
          <el-option v-for="item in options_project" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择设备" prop="device">
        <!-- <el-select v-model="ruleForm.device" disabled class="m-2" placeholder="请选择需要绑定的设备" style="width: 360px">
          <el-option v-for="item in options_device" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-input v-model="ruleForm.device" disabled style="width: 360px" />
      </el-form-item>
      <!-- <el-form-item label="在项目中的名称" prop="deviceName">
        <el-input v-model="ruleForm.deviceName" @input="ruleForm.deviceName = ruleForm.deviceName.replace(/\s*/g, '')"
          style="width: 360px" maxlength="12" show-word-limit />
      </el-form-item> -->
      <!-- <el-form-item label="设备序列号" prop="deviceId">
        <el-input v-model="ruleForm.deviceId" disabled style="width: 360px" />
      </el-form-item> -->
      <!-- <el-form-item label="设备类型" prop="deviceType">
        <el-input v-model="ruleForm.deviceType" disabled style="width: 360px" />
      </el-form-item> -->
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
import { getProjectList, tagDeviceBinding, addDeviceBinding } from "@/utils/api.js";
const router = useRouter();
const route = useRoute();
const store = useStore();
let addType = "batch"//batch批量设备绑定 tag整个套件绑定
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
onMounted(() => {
  _getProjectList()
  addType = route.query.tid ? 'tag' : 'batch'
  if (addType == 'tag') {
    ruleForm.value.device = route.query.text + '套件下的所有设备'
  } else {
    ruleForm.value.device = route.query.text + '等' + route.query.dids.split(',').length + '个设备'
  }
})
const ruleFormRef = ref(null)
let options_project = ref([])
let options_device = ref([
  { value: 'vvv1', label: 'lll1' },
  { value: 'vvv2', label: 'lll2' },
  { value: 'vvv3', label: 'lll3' },
  { value: 'vvv4', label: 'lll4' },
])
const rules = reactive({
  project: [{ required: true, message: '请选择项目', trigger: 'change' }],
  device: [{ required: true, message: '请选择设备', trigger: 'change' }],
  // deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
})
let ruleForm = ref({})
const areaChange = (area) => {
  console.log('area', area);
}
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (addType == 'batch') {
        let data = {
          dids: route.query.dids.split(','),
          name: '',
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
      } else {
        let data = {
          tid: route.query.tid,
          name: '',
          remarks: ruleForm.value.remarks,
          trussProjects: {
            id: ruleForm.value.project
          }
        }
        tagDeviceBinding(data).then(res => {
          if (res.code == 200) {
            ElMessage.success("操作成功");
            router.push({ path: '/managedevice' })
          }
        })
      }
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