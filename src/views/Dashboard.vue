<template>
  <div class="dash">
    <div class="label">项目管理与设备管理</div>
    <div class="wrap">
      <div class="button" @click="skip('/createproject')">新建项目</div>
      <div class="button" @click="skip('/manageproject')">项目管理</div>
    </div>
    <div class="wrap">
      <div class="button" @click="skip('/devicebinding')">新增设备绑定</div>
      <div class="button" @click="skip('/managedevice')">设备管理</div>
      <div class="button" @click="skip('/pointbinding')">点位绑定</div>
    </div>
    <div class="label">项目检测报告</div>
    <div class="wrap">
      <div class="button" @click="skip('/projectalarm')">项目异常预警</div>
      <div class="button" @click="skip('/viewpoint')">查看监测点位</div>
      <div class="button" @click="skip('/viewreport')">查看数据报告</div>
    </div>
    <div class="label">系统设置</div>
    <div class="wrap">
      <div class="button" @click="skip('/manageuser')">用户管理</div>
    </div>
  </div>
</template>
<script setup name="dashboard">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import { ref, onMounted, watch, nextTick } from "vue";
// import { getSpheresAndSts } from "@/utils/api.js";
import { useRouter } from "vue-router";
const router = useRouter();
onMounted(() => { })
const skip = (path) => {
  router.push({ path: path })
}
</script>
<style lang="scss" scoped>
// :deep(.el-upload-list__item .el-icon--close-tip) {
//   display: none !important;
// }

.dash {
  margin: 20px;

  .label {
    margin-top: 40px;
    color: #aaa;
    border-left: solid 4px #000;
    padding-left: 10px;
  }

  .wrap {
    display: flex;
    margin-top: 20px;
  }
}
</style>