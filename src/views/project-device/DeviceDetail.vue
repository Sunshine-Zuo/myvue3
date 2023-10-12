<template>
  <div class="dash">
    <div class="title">设备详情</div>
    <div class="item">
      <div class="label">设备名称：</div>
      <div class="text">{{ deviceInfo.name }}</div>
    </div>
    <div class="item">
      <div class="label">设备序列号：</div>
      <div class="text">{{ deviceInfo.uuid }}</div>
    </div>
    <div class="item">
      <div class="label">设备类型：</div>
      <div class="text">{{ deviceInfo.type }}</div>
    </div>
    <div class="item">
      <div class="label">购买日期：</div>
      <div class="text">{{ deviceInfo.purchaseTime }}</div>
    </div>
    <div class="item">
      <div class="label">创建时间：</div>
      <div class="text">{{ deviceInfo.createTime }}</div>
    </div>
    <div class="item">
      <div class="label">备注说明：</div>
      <div class="text">{{ deviceInfo.remarks }}</div>
    </div>
    <div @click="router.go(-1)" class="button current" style="width: 120px;margin-top: 40px;">返回</div>
  </div>
</template>
<script setup>
import { getDeviceInfo } from "@/utils/api.js";
const router = useRouter()
const route = useRoute();
const store = useStore();
let deviceInfo = ref({})
onMounted(() => {
  _getDeviceInfo()
})
const _getDeviceInfo = () => {
  let deviceId = route.query.id
  getDeviceInfo({ id: deviceId }).then(res => {
    if (res.code == 200) {
      deviceInfo.value = res.data
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