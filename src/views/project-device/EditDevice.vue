<template>
  <div class="dash">
    <div class="title">编辑设备信息</div>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="ruleForm.name" @input="ruleForm.name = ruleForm.name.replace(/\s*/g, '')"
          style="width: 360px" />
      </el-form-item>
      <el-form-item label="设备序列号" prop="uuid">
        <el-input v-model="ruleForm.uuid" disabled style="width: 360px" />
      </el-form-item>
      <el-form-item label="设备类型" prop="type">
        <el-input v-model="ruleForm.type" disabled style="width: 360px" />
      </el-form-item>
      <el-form-item label="购买日期" prop="purchaseTime">
        <el-date-picker v-model="ruleForm.purchaseTime" type="datetime" format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择时间" style="width: 360px" />
      </el-form-item>
      <el-form-item label="备注说明" prop="remarks">
        <el-input v-model="ruleForm.remarks" :rows="4" style="width: 360px" type="textarea" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
        <!-- <el-button @click="resetForm(ruleFormRef)">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { getDeviceInfo, editDevice } from "@/utils/api.js";
import { ElMessage } from "element-plus";
const router = useRouter()
const route = useRoute();
const store = useStore();
const rules = reactive({
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  uuid: [{ required: true, message: '请输入设备序列号', trigger: 'blur' }],
  type: [{ required: true, message: '请输入设备类型', trigger: 'blur' }],
})
const ruleFormRef = ref(null)
let ruleForm = ref({})
onMounted(() => {
  _getDeviceInfo()
})
const _getDeviceInfo = () => {
  let deviceId = route.query.id
  getDeviceInfo({ id: deviceId }).then(res => {
    if (res.code == 200) {
      ruleForm.value = res.data
    }
  })
}
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let data = {
        id: ruleForm.value.id,
        name: ruleForm.value.name,
        purchaseTime: ruleForm.value.purchaseTime,
        remarks: ruleForm.value.remarks
      }
      editDevice(data).then(res => {
        if (res.code == 200) {
          ElMessage.success("编辑成功");
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