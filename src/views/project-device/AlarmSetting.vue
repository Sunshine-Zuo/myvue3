<template>
  <div class="dash">
    <div class="title">预警设置</div>
    <!-- <div class="button">恢复默认设置</div> -->
    <div class="wrap">
      <div class="label">设备名称：</div>
      <div class="text">{{ ruleForm.name }}</div>
      <div class="label">设备类型：</div>
      <div class="text">{{ ruleForm.trussDevices && ruleForm.trussDevices.type }}</div>
    </div>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="140px" class="demo-ruleForm">
      <!-- <el-form-item label="心跳时间间隔" prop="intervalValue">
        <el-input v-model="ruleForm.intervalValue" disabled style="width: 360px" />
        <div class="tip">(单位:秒)</div>
      </el-form-item> -->
      <template v-if="ruleForm.trussDevices && ruleForm.trussDevices.type == '激光测距仪'">
        <el-form-item label="梁长度" prop="beamLength">
          <el-input v-model="ruleForm.beamLength"
            @input="ruleForm.beamLength = ruleForm.beamLength.replace(/[^\d.]/g, '')" style="width: 360px"
            placeholder="请输入桁架长度" />
          <div class="tip">(单位:mm)</div>
        </el-form-item>
        <el-form-item label="初始挠度" prop="lnitialDeflection">
          <el-input v-model="ruleForm.lnitialDeflection"
            @input="ruleForm.lnitialDeflection = ruleForm.lnitialDeflection.replace(/[^\d.]/g, '')" style="width: 360px"
            placeholder="请输入初始挠度" />
          <div class="tip">(单位:mm)</div>
        </el-form-item>
        <el-form-item label="蓝色预警值" prop="deflectionBlueValue">
          <el-input v-model="ruleForm.deflectionBlueValue"
            @input="ruleForm.deflectionBlueValue = ruleForm.deflectionBlueValue.replace(/[^\d.]/g, '')"
            placeholder="请输入蓝色预警值(挠度/梁长度)" style="width: 360px" />
          <div class="tip">(默认:0.00167)</div>
        </el-form-item>
        <el-form-item label="橙色预警值" prop="deflectionOrangeValue">
          <el-input v-model="ruleForm.deflectionOrangeValue"
            @input="ruleForm.deflectionOrangeValue = ruleForm.deflectionOrangeValue.replace(/[^\d.]/g, '')"
            placeholder="请输入橙色预警值(挠度/梁长度)" style="width: 360px" />
          <div class="tip">(默认:0.0025)</div>
        </el-form-item>
      </template>
      <template v-if="ruleForm.trussDevices && ruleForm.trussDevices.type == '倾角传感器'">
        <el-form-item label="X轴蓝色倾角预警值" prop="inclinationCriticalityX">
          <el-input v-model="ruleForm.inclinationCriticalityX"
            @input="ruleForm.inclinationCriticalityX = ruleForm.inclinationCriticalityX.replace(/[^\d.]/g, '')"
            placeholder="请输入预警倾角[sin(当前测量值-首次测量值)*1000]" style="width: 360px" />
          <div class="tip">(默认:5)</div>
        </el-form-item>
        <el-form-item label="Y轴蓝色倾角预警值" prop="inclinationCriticalityY">
          <el-input v-model="ruleForm.inclinationCriticalityY"
            @input="ruleForm.inclinationCriticalityY = ruleForm.inclinationCriticalityY.replace(/[^\d.]/g, '')"
            placeholder="请输入预警倾角[sin(当前测量值-首次测量值)*1000]" style="width: 360px" />
          <div class="tip">(默认:5)</div>
        </el-form-item>
        <el-form-item label="X轴橙色倾角预警值" prop="inclinationWarningX">
          <el-input v-model="ruleForm.inclinationWarningX"
            @input="ruleForm.inclinationWarningX = ruleForm.inclinationWarningX.replace(/[^\d.]/g, '')"
            placeholder="请输入预警倾角[sin(当前测量值-首次测量值)*1000]" style="width: 360px" />
          <div class="tip">(默认:10)</div>
        </el-form-item>
        <el-form-item label="Y轴橙色倾角预警值" prop="inclinationWarningY">
          <el-input v-model="ruleForm.inclinationWarningY"
            @input="ruleForm.inclinationWarningY = ruleForm.inclinationWarningY.replace(/[^\d.]/g, '')"
            placeholder="请输入预警倾角[sin(当前测量值-首次测量值)*1000]" style="width: 360px" />
          <div class="tip">(默认:10)</div>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
        <!-- <el-button @click="resetForm(ruleFormRef)">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { getProjectDeviceInfo, editProjectDevice } from "@/utils/api.js";
import { ElMessage } from "element-plus";
const route = useRoute();
const router = useRouter();
const store = useStore();
const _getProjectDeviceInfo = () => {
  let deviceId = route.query.id
  getProjectDeviceInfo({ id: deviceId }).then(res => {
    if (res.code == 200) {
      ruleForm.value = res.data
    }
  })
}
onMounted(() => {
  _getProjectDeviceInfo()
})
const rules = reactive({
  value1: [{ required: true, message: '请选择项目', trigger: 'change' }],
})
let ruleForm = ref({})
const ruleFormRef = ref(null)
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let data = JSON.parse(JSON.stringify(ruleForm.value))
      delete data.bdStatus
      editProjectDevice(data).then(res => {
        if (res.code == 200) {
          ElMessage.success("操作成功");
          router.push({ path: '/manageprojectdevice' })
        }
      })
    }
  })
}

</script>
<style lang='scss' scoped>
.dash {
  position: relative;
}

.title {
  font-size: 24px;
  font-weight: bold;
  height: 30px;
  margin-bottom: 20px;
}

.wrap {
  display: flex;
  align-items: center;
  margin: 20px 0;
  background-color: #eee;
  height: 40px;
  font-size: 14px;

  .label {
    color: #aaa;
    margin-left: 20px;
  }

  .text {}
}

.button {
  position: absolute;
  right: 0;
  top: 0;
}

.tip {
  color: #aaa;
  margin-left: 10px;
}
</style>