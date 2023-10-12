<template>
  <div class="dash" id="dash">
    <div class="title">
      报告总览<span class="title-tip">数据更新于{{ overviewData.updateTime }}</span>
      <svg @click="handleDownload" t="1693992551808" class="download-icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="6629" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24">
        <path
          d="M178.74 919.5c-72.65 0-114.25-41.6-114.25-114.25v-199.8c0-12.31 9.96-22.26 22.27-22.26 33.4 0 67.38-4.69 67.38 26.95v189.84c0 15.82 12.89 28.12 28.12 28.12H842c15.82 0 28.71-12.89 28.71-28.71V604.87c0-12.3 9.96-22.26 22.26-22.26 33.4 0 67.38-4.69 67.38 26.95v200.39c0 72.65-35.74 108.39-108.39 108.39l-673.22 1.16z m0 0"
          p-id="6630"></path>
        <path
          d="M512.13 677.52c-24.61 0-44.53-19.92-44.53-44.53V131.45c0-24.61 19.92-26.95 44.53-26.95s44.53 2.34 44.53 26.95v501.54c0 24.61-19.92 44.53-44.53 44.53z m0 0"
          p-id="6631"></path>
        <path
          d="M509.79 693.93c-11.72 0-23.44-4.69-31.64-12.89L273.08 475.97c-21.67-21.68-20.51-42.77 0-63.28 20.51-20.51 42.77-20.51 63.28 0l173.43 173.43 183.39-183.39c15.24-15.24 37.5-11.13 55.08 6.44 17.58 17.58 25.2 39.84 8.21 56.83L541.43 680.45c-8.21 8.2-19.92 12.89-31.64 12.89v0.59z m0 0"
          p-id="6632"></path>
      </svg>
    </div>
    <div class="data">
      <div class="data-wrap">
        <div class="number">{{ overviewData.deviceCount }}</div>
        <div class="text">设备总数</div>
      </div>
      <div class="data-wrap">
        <div class="number">{{ overviewData.onlineDeviceCount }}</div>
        <div class="text">在线设备</div>
      </div>
      <div class="data-wrap">
        <div class="number">{{ overviewData.offlineDeviceCount }}</div>
        <div class="text">离线设备</div>
      </div>
      <div class="data-wrap">
        <div class="number blue">{{ overviewData.bluePointCount }}</div>
        <div class="text blue">蓝色预警点位</div>
      </div>
      <div class="data-wrap">
        <div class="number orange">{{ overviewData.orangePointCount }}</div>
        <div class="text orange">橙色预警点位</div>
      </div>
      <div class="data-wrap">
        <div class="number red">{{ overviewData.inclinationSinChangeCount }}</div>
        <div class="text">倾角变化累计</div>
      </div>
      <div class="data-wrap">
        <div class="number red">{{ overviewData.deflectionChangeCount }}</div>
        <div class="text">挠度/量长度变化累计</div>
      </div>
    </div>
    <div class="main">
      <div class="left">
        <div class="main-title">监测点位分布</div>
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
        <div class="chart chart1"></div>
      </div>
      <div class="right">
        <div class="main-title">倾角和挠度监测</div>
        <div class="tip">
          <div class="circle" style="background-color: #ac0fff;"></div>
          <div class="text">倾角累计值</div>
          <div class="circle" style="background-color: #42D048;"></div>
          <div class="text">挠度/梁长度累计值</div>
        </div>
        <div class="chart chart2"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Download } from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import { getOverview, getOverviewTrend } from "@/utils/api.js";
import domtoimage from "dom-to-image-more";

const router = useRouter();
const store = useStore();
const currentProject = computed(() => store.state.currentProject);


let overviewData = ref({})
let overviewTrendData = ref({})
const _getOverview = () => {
  getOverview({ pid: currentProject.value.id }).then(res => {
    if (res.code == 200) {
      overviewData.value = res.data[0] || {}
      initChart1(overviewData.value)
    }
  })
}
const _getOverviewTrend = () => {
  //设备类型 0倾角传感器 1激光测距仪
  Promise.all([getOverviewTrend({ pid: currentProject.value.id, type: 0 }), getOverviewTrend({ pid: currentProject.value.id, type: 1 })]).then(arr => {
    if (arr[0].code == 200 && arr[1].code == 200) {
      overviewTrendData.value = [arr[0].data, arr[1].data]
      initChart2(overviewTrendData.value)
    }
  })
}
watch(currentProject, (val) => {
  if (val && val.id) {
    _getOverview()
    _getOverviewTrend()
  }
}, { immediate: true })
let chart1 = null, chart2 = null
onMounted(() => { })
onBeforeUnmount(() => {
  chart1 && chart1.dispose()
  chart2 && chart2.dispose()
})
const initChart1 = (data) => {
  let seriesData = [
    { value: data.orangePointCount || 0, name: '橙色预警点位' },
    { value: data.bluePointCount || 0, name: '蓝色预警点位' },
    { value: data.normalDeviceCount || 0, name: '正常点位' },
    { value: data.offlineDeviceCount || 0, name: '离线点位' }
  ]
  if (!chart1) {
    chart1 = echarts.init(document.querySelector('.chart1'));
  }
  const colors = ['#FFBF00', '#37A2FF', '#42D048', '#a5aba9'];
  chart1.setOption({
    color: colors,
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '监测点位分布',
        type: 'pie',
        radius: '80%',
        data: seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}
const initChart2 = (data) => {
  let xAxisData = [], seriesData1 = [], seriesData2 = []
  for (let i = 0, l = data[0].length; i < l; i++) {
    xAxisData.push(data[0][i].date)
    seriesData1.push(data[0][i].cumSinValu)
    seriesData2.push(data[1][i].cumValu)
  }
  if (!chart2) {
    chart2 = echarts.init(document.querySelector('.chart2'));
  }
  const colors = ['#ac0fff', '#42D048'];
  chart2.setOption({
    color: colors,
    tooltip: {
      trigger: 'axis',
      // axisPointer: {
      //   type: 'cross'
      // }
    },
    grid: {
      // right: '20%'
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        // prettier-ignore
        data: xAxisData
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '倾角累计值',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0]
          }
        },
        // axisLabel: {
        //   formatter: '{value} °'
        // }
      },
      {
        type: 'value',
        name: '挠度/梁长度累计值',
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[1]
          }
        },
        // axisLabel: {
        //   formatter: '{value} °'
        // }
      }
    ],
    series: [
      {
        name: '倾角累计值',
        type: 'line',
        data: seriesData1
      },
      {
        name: '挠度/梁长度累计值',
        type: 'line',
        yAxisIndex: 1,
        data: seriesData2
      }
    ]
  })
}

const handleDownload = () => {
  domtoimage
    .toJpeg(document.getElementById('dash'), {
      bgcolor: '#ffffff', filter: (node) => {
        return !(node.classList && node.classList.contains('download-icon'))
      }
    })
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = '报告总览.jpeg';
      link.href = dataUrl;
      link.click();
    });
}
</script>
<style lang='scss' scoped>
.title {
  padding: 0 10px;
  font-size: 24px;
  font-weight: bold;
  height: 30px;
  position: relative;

  .title-tip {
    color: #aaa;
    font-size: 14px;
    font-weight: normal;
    margin-left: 20px;
  }

  .download-icon {
    position: absolute;
    font-size: 24px;
    color: #7299fd;
    fill: #7299fd;
    right: 10px;
    top: 10px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background-color: #ddd;
    }
  }
}

.data {
  display: flex;
  margin-top: 20px;
  padding: 0 10px;
  justify-content: center;

  .data-wrap {
    flex: 1;
    margin: 0 10px;
    background-color: #f7f7f7;
    border: solid 1px #ddd;
    border-radius: 6px;
    height: 100px;
    max-width: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .number {
      font-size: 24px;
      font-weight: bold;

    }

    .text {
      font-size: 14px;
      white-space: nowrap;
    }

    .red {
      color: #eb0000;
    }

    .blue {
      color: #37A2FF;
    }

    .orange {
      color: #FFBF00;
    }
  }
}


.main {
  position: relative;
  margin-top: 20px;
  padding: 0 10px;
  display: flex;

  .left,
  .right {
    flex: 1;
    // border: solid 1px #DDD;

    .chart {
      height: 300px;
    }
  }

  .main-title {
    font-size: 18px;
    font-weight: bold;
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

}
</style>