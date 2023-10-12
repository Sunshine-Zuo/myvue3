<template>
  <div class="dash">
    <div class="title">新建项目</div>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="ruleForm.name" @input="ruleForm.name = ruleForm.name.replace(/\s*/g, '')" style="width: 360px"
          maxlength="16" show-word-limit />
      </el-form-item>
      <el-form-item label="布展时间" prop="exhibitionTime">
        <el-date-picker v-model="ruleForm.exhibitionTime" type="datetime" format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择时间" class="uuui" style="width: 360px" />
      </el-form-item>
      <el-form-item label="开展时间" prop="startTime">
        <el-date-picker v-model="ruleForm.startTime" type="datetime" format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择时间" style="width: 360px" />
      </el-form-item>
      <el-form-item label="撤展时间" prop="endTime">
        <el-date-picker v-model="ruleForm.endTime" type="datetime" format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择时间" style="width: 360px" />
      </el-form-item>
      <el-form-item label="项目负责人" prop="responsibleIds">
        <el-select v-model="ruleForm.responsibleIds" multiple placeholder="请选择项目负责人" style="width: 500px">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="预警接收人" prop="warningIds">
        <el-select v-model="ruleForm.warningIds" multiple placeholder="请选择预警接收人" style="width: 500px">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目位置">
        <div style="display: flex;">
          <el-form-item prop="address1">
            <el-cascader :options="pcC" v-model="selectedAddress1" :props="CascaderProps" placeholder="请选择省市"
              style="width: 210px">
            </el-cascader>
          </el-form-item>
          <el-form-item prop="address" class="ml-10">
            <el-input v-model="ruleForm.address" placeholder="请输入详细位置" style="width: 280px" />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
        <!-- <el-button @click="resetForm(ruleFormRef)">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { addProject, getUserList } from "@/utils/api.js";
import { ElMessage } from "element-plus";
import { watch } from "vue";
import pcC from "@/assets/map/pc-code.json"
// code转汉字大对象
const codeToText = {};
pcC.forEach(province => {
  codeToText[province.code] = province.name;
  province.children && province.children.forEach(city => {
    codeToText[city.code] = city.name;
    city.children && city.children.forEach(area => {
      codeToText[area.code] = area.name;
    });
  });
});
let CascaderProps = {
  value: "code",
  label: "name"
}
const router = useRouter();
const _getUserList = () => {
  let data = {
    pageNum: 1,
    pageSize: 9999,
  }
  getUserList(data).then(res => {
    if (res.code == 200) {
      options.value = res.data.rows
    }
  })
}
onMounted(() => {
  _getUserList()
})
let selectedAddress1 = ref('')
watch(selectedAddress1, (val) => {
  ruleForm.value.province = codeToText[val[0]]
  ruleForm.value.city = codeToText[val[1]]
})
const ruleFormRef = ref(null)
let options = ref([])
const validateName = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入项目名称'))
  } else {
    if (ruleForm.value.name !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('name', () => null)
    }
    callback()
  }
}
const rules = reactive({
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }, { validator: validateName, trigger: 'blur' }],
})
let ruleForm = ref({})
const areaChange = (area) => {
  console.log('area', area);
}
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let data = JSON.parse(JSON.stringify(ruleForm.value))
      if (Array.isArray(data.responsibleIds)) {
        data.responsibleIds = data.responsibleIds.join(',')
      }
      if (Array.isArray(data.warningIds)) {
        data.warningIds = data.warningIds.join(',')
      }
      addProject(data).then(res => {
        if (res.code == 200) {
          ElMessage.success("操作成功");
          router.push({ path: '/manageproject' })
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