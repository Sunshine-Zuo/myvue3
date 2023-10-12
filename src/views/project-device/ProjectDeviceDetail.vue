<template>
  <div class="dash">
    <div class="title">项目设备详情</div>
    <div class="item">
      <div class="label">所属项目：</div>
      <div class="text">{{ projectdeviceInfo.trussProjects && projectdeviceInfo.trussProjects.name }}</div>
    </div>
    <div class="item">
      <div class="label">设备名称：</div>
      <div class="text">{{ projectdeviceInfo.name }}</div>
    </div>
    <div class="item">
      <div class="label">设备序列号：</div>
      <div class="text">{{ projectdeviceInfo.trussDevices && projectdeviceInfo.trussDevices.uuid }}</div>
    </div>
    <div class="item">
      <div class="label">设备类型：</div>
      <div class="text">{{ projectdeviceInfo.trussDevices && projectdeviceInfo.trussDevices.type }}</div>
    </div>
    <div class="item">
      <div class="label">购买日期：</div>
      <div class="text">{{ projectdeviceInfo.trussDevices && projectdeviceInfo.trussDevices.purchaseTime }}</div>
    </div>
    <div class="item">
      <div class="label">创建时间：</div>
      <div class="text">{{ projectdeviceInfo.createTime }}</div>
    </div>
    <div class="divider"></div>
    <template v-if="projectdeviceInfo.trussDevices && projectdeviceInfo.trussDevices.type === '激光测距仪'">
      <div class="item">
        <div class="label">梁长度：</div>
        <div class="text" v-if="projectdeviceInfo.beamLength !== null">{{ projectdeviceInfo.beamLength }} mm</div>
      </div>
      <div class="item">
        <div class="label">初始挠度：</div>
        <div class="text" v-if="projectdeviceInfo.lnitialDeflection !== null">{{ projectdeviceInfo.lnitialDeflection }} mm
        </div>
      </div>
      <div class="item">
        <div class="label">蓝色预警值：</div>
        <div class="text" v-if="projectdeviceInfo.deflectionBlueValue !== null">{{ projectdeviceInfo.deflectionBlueValue
        }}</div>
      </div>
      <div class="item">
        <div class="label">橙色预警值：</div>
        <div class="text" v-if="projectdeviceInfo.deflectionOrangeValue !== null">{{
          projectdeviceInfo.deflectionOrangeValue }}</div>
      </div>
    </template>
    <template v-if="projectdeviceInfo.trussDevices && projectdeviceInfo.trussDevices.type === '倾角传感器'">
      <div class="item">
        <div class="label">X轴蓝色倾角预警值：</div>
        <div class="text" v-if="projectdeviceInfo.inclinationCriticalityX !== null">{{
          projectdeviceInfo.inclinationCriticalityX }}</div>
      </div>
      <div class="item">
        <div class="label">Y轴蓝色倾角预警值：</div>
        <div class="text" v-if="projectdeviceInfo.inclinationCriticalityY !== null">{{
          projectdeviceInfo.inclinationCriticalityY }}</div>
      </div>
      <div class="item">
        <div class="label">X轴橙色倾角预警值：</div>
        <div class="text" v-if="projectdeviceInfo.inclinationWarningX !== null">{{ projectdeviceInfo.inclinationWarningX
        }}</div>
      </div>
      <div class="item">
        <div class="label">Y轴橙色倾角预警值：</div>
        <div class="text" v-if="projectdeviceInfo.inclinationWarningY !== null">{{ projectdeviceInfo.inclinationWarningY
        }}</div>
      </div>
    </template>
    <div class="divider"></div>
    <div class="item">
      <div class="label">备注说明：</div>
      <div class="text">{{ projectdeviceInfo.remarks }}</div>
    </div>
    <div @click="router.go(-1)" class="button current" style="width: 120px;margin-top: 40px;">返回</div>
  </div>
</template>
<script setup>
import { getProjectDeviceInfo } from "@/utils/api.js";
const router = useRouter()
const route = useRoute();
const store = useStore();
let projectdeviceInfo = ref({})
onMounted(() => {
  _getProjectDeviceInfo()
})
const _getProjectDeviceInfo = () => {
  let deviceId = route.query.id
  getProjectDeviceInfo({ id: deviceId }).then(res => {
    if (res.code == 200) {
      projectdeviceInfo.value = res.data
    }
  })
}

</script>
<style lang='scss' scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  height: 30px;
  margin-bottom: 20px;
}

.item {
  display: flex;
  margin: 20px 0;

  .label {
    color: #aaa;
  }
}

.divider {
  border-top: solid 1px #EEE;
  margin: 20px 0;
}
</style>