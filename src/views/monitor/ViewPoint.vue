<template>
  <div class="dash">
    <div class="title">查看监测点位</div>
    <div class="tip">
      <div class="circle" style="background-color: #FFBF00;"></div>
      <div class="text">橙色预警点位</div>
      <div class="circle" style="background-color: #37A2FF;"></div>
      <div class="text">蓝色预警点位</div>
      <div class="circle" style="background-color: #42D048;"></div>
      <div class="text">正常点位</div>
      <div class="circle" style="background-color: #a5aba9;"></div>
      <div class="text">离线点位</div>
    </div>
    <div class="main">
      <div class="img-wrap">
        <img class="bg-img" :src="image" alt="">
        <template v-for="(item, index) in pointData" :key="'point'+index">
          <div v-if="item.coordinate" class="marker-wrap" :style="getMarkerStyle(item)">
            <svg @click="selected_point = item" class="marker" :class="getClass(item)" t="1693986803994"
              viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="673"
              xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24">
              <path
                d="M839.946482 389.336542c0-179.917116-147.043874-325.820973-328.561518-325.820973-181.460336 0-328.561518 145.903857-328.561518 325.820973 0 59.446709 16.307166 114.955546 44.308214 162.939652l-0.351011 0 284.574638 407.316894 284.690277-407.316894-0.379665 0C823.757001 504.292088 839.946482 448.783251 839.946482 389.336542M511.413617 552.215816c-90.716353 0-164.280247-72.922251-164.280247-162.907928 0-89.927346 73.563895-162.907928 164.280247-162.907928 90.802315 0 164.280247 72.980582 164.280247 162.907928C675.693865 479.293565 602.215932 552.215816 511.413617 552.215816"
                p-id="674"></path>
            </svg>
            <div class="text" :class="getClassText(item)" v-if="item.id == selected_point.id">
              <div>{{ item.name }}</div>
              <div class="mt-10" v-if="item.detectionStatus !== '离线'">
                <template v-if="item.type === '激光测距仪'">
                  <div>挠度值：{{ item.deflectionCount }}</div>
                  <div>挠度/梁长度：{{ item.alertDeflection }}</div>
                  <div>测距长度：{{ item.distance }}</div>
                </template>
                <template v-if="item.type === '倾角传感器'">
                  <div>x轴倾角：{{ item.inclinationXSinCount }}</div>
                  <div>y轴倾角：{{ item.inclinationYSinCount }}</div>
                </template>
              </div>
              <div class="mt-10">测点状态：{{ item.detectionStatus }}</div>
              <template v-if="item.detectionStatus !== '离线'">
                <div>剩余电量：{{ parseFloat(item.soc) >= 0 ? (item.soc + '%') : '--' }}</div>
                <div>上报时间：{{ item.dateTime }}</div>
              </template>
              <div class="mt-10" @click="handleDetial(item)">查看详情>></div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getPointData, getProjectInfo } from "@/utils/api.js";
const router = useRouter();
const store = useStore();
const currentProject = computed(() => store.state.currentProject);

let pointData = ref([])
let selected_point = ref({})
let image = ref('')
const _getPointData = () => {
  getPointData({ pid: currentProject.value.id }).then(res => {
    if (res.code == 200) {
      pointData.value = res.data
      selected_point.value = res.data[0] || {}
    }
  })
}
const _getProjectInfo = () => {
  let projectId = currentProject.value.id
  getProjectInfo({ id: projectId }).then(res => {
    if (res.code == 200) {
      image.value = res.data.bitmapImg
    }
  })
}
watch(currentProject, (val) => {
  if (val && val.id) {
    _getPointData()
    _getProjectInfo()
  }
}, { immediate: true })
onMounted(() => { })
const handleDetial = (item) => {
  router.push({ path: 'viewreport', query: { did: item.did } })
}
const getClass = (item) => {
  let classObj = {}
  if (item.detectionStatus === '橙色预警') {
    classObj.orange = true
  } else if (item.detectionStatus === '蓝色预警') {
    classObj.blue = true
  } else if (item.detectionStatus === '正常') {
    classObj.green = true
  } else {
    classObj.gray = true
  }
  return classObj
}
const getClassText = (item) => {
  let classObj = {
    'isleft': item.coordinate && item.coordinate.split(',')[0] > 60,
    'istop': item.coordinate && item.coordinate.split(',')[1] > 60
  }
  if (item.detectionStatus === '橙色预警') {
    classObj.orange = true
  } else if (item.detectionStatus === '蓝色预警') {
    classObj.blue = true
  } else if (item.detectionStatus === '正常') {
    classObj.green = true
  } else {
    classObj.gray = true
  }
  return classObj
}
const resizeBg = async () => {
  await nextTick()
  let main = document.querySelector('.main')
  let bg = document.querySelector('.bg-img')
  bg.style.maxWidth = (main.clientWidth - 26) + 'px'
  bg.style.maxHeight = (main.clientHeight - 26) + 'px'
}
resizeBg()
window.addEventListener('resize', resizeBg)

const getMarkerStyle = (item) => {
  let coordinate = item.coordinate.split(',')
  return {
    left: coordinate[0] + '%',
    top: coordinate[1] + '%'
  }
}
</script>
<style lang='scss' scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  height: 30px;
}

.tip {
  height: 30px;
  display: flex;
  align-items: center;
  margin-top: 10px;

  .circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 4px;
  }

  .text {
    margin-right: 20px;
    font-size: 14px;
  }
}

.main {
  border: solid 1px #eee;
  height: calc(100vh - 190px);
  min-height: 500px;
  position: relative;
  overflow: auto;
  margin-top: 10px;

  .img-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: solid 1px #eee;

    .marker-wrap {
      position: absolute;

      .marker {
        height: 24px;
        position: absolute;
        top: -19px;
        left: -10px;

        &.orange {
          fill: #FFBF00;
        }

        &.blue {
          fill: #37A2FF;
        }

        &.green {
          fill: #42D048;
        }

        &.gray {
          fill: #a5aba9;
        }
      }

      .text {
        white-space: nowrap;
        font-size: 14px;
        background-color: #42D048;
        color: #fff;
        position: absolute;
        left: 12px;
        top: -16px;
        border-radius: 4px;
        padding: 8px;

        &.orange {
          background-color: #FFBF00;
        }

        &.blue {
          background-color: #37A2FF;
        }

        &.green {
          background-color: #42D048;
        }

        &.gray {
          background-color: #a5aba9;
        }

        &.isleft {
          left: -10px;
          transform: translateX(-100%);
        }

        &.istop {
          transform: translateY(-100%);
        }

        &.isleft.istop {
          transform: translateX(-100%) translateY(-100%);
        }
      }
    }
  }
}
</style>