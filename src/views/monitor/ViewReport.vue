<template>
  <div class="dash">
    <div class="title">查看数据报告</div>
    <div class="wrap">
      <el-select v-model="device" class="m-2" placeholder="请选择设备" style="width: 200px">
        <el-option v-for="item in options_device" :key="item.did" :label="item.name" :value="item.did" />
      </el-select>
      <el-date-picker v-model="date" class="datepicker ml-10" type="daterange" range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :clearable=false />
      <div class="button ok ml-10" @click="doSearch">查询</div>
      <!-- <div class="button ml-10" @click="doReset">重置</div> -->
    </div>
    <div class="chart-wrap">
      <div id="chart" :class="[tableData.length > 0 ? 'show' : '']" class="mt-20"></div>
      <div class="empty" v-show="!tableData.length > 0">暂无数据</div>
    </div>
    <div class="subtitle mt-20">监测记录</div>
    <el-table :data="tableData" border stripe style="width: 100%;min-height:500px;margin: 20px 0;">
      <el-table-column align="center" label="监测时间" width="120">
        <template #default="scope">
          <div>{{ scope.row.createTime && scope.row.createTime.split(' ')[0] }}</div>
          <div>{{ scope.row.createTime && scope.row.createTime.split(' ')[1] }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="recordStatus" label="状态" />
      <template v-if="tableData[0] && tableData[0].type == '倾角传感器'">
        <el-table-column align="center" prop="x" label="x轴" />
        <el-table-column align="center" prop="y" label="y轴" />
        <el-table-column align="center" label="x轴变化量">
          <template #default="scope">
            <div style="white-space: nowrap;">本次：{{ scope.row.xsinThisValue }}</div>
            <div style="white-space: nowrap;">累计：{{ scope.row.xsinCumValue }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="y轴变化量">
          <template #default="scope">
            <div style="white-space: nowrap;">本次：{{ scope.row.ysinThisValue }}</div>
            <div style="white-space: nowrap;">累计：{{ scope.row.ysinCumValue }}</div>
          </template>
        </el-table-column>
      </template>
      <template v-if="tableData[0] && tableData[0].type == '激光测距仪'">
        <el-table-column align="center" prop="deflection" label="挠度值" />
        <el-table-column align="center" prop="alertDeflection" label="挠度/梁长度" />
        <el-table-column align="center" prop="distance" label="测距长度" />
        <el-table-column align="center" label="挠度/梁长度变化量">
          <template #default="scope">
            <div style="white-space: nowrap;">本次：{{ scope.row.thisValue }}</div>
            <div style="white-space: nowrap;">累计：{{ scope.row.cumValue }}</div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" /> -->
  </div>
</template>
<script setup>
import dayjs from 'dayjs'
import * as echarts from 'echarts';
import { getDataReport, getProjectDeviceList } from "@/utils/api.js";

const router = useRouter();
const route = useRoute();
const store = useStore();

let device = ref('')
let date = ref([dayjs().subtract(1, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')])
let options_device = ref([])
const currentProject = computed(() => store.state.currentProject);
let currentPage = ref(1)
let pageSize = ref(50)
let total = ref(0)

let chart1 = null
const initChart1 = (data) => {
  if (!chart1) {
    chart1 = echarts.init(document.querySelector('#chart'));
  }
  if (!data) return
  //按createTime升序排序
  data = JSON.parse(JSON.stringify(data))
  data.sort((a, b) => {
    return a.createTime.localeCompare(b.createTime)
  })
  let xAxisData = [], seriesData1 = [], seriesData2 = [], seriesData3 = []
  data.forEach(e => {
    xAxisData.push(e.createTime)
    seriesData1.push(e.deflection)
    seriesData2.push(e.alertDeflection)
    seriesData3.push(e.distance)
  })
  const colors = ['#7299fd', '#43d147', '#ac0fff'];
  chart1.setOption({
    color: colors,
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      // right: '20%'
    },
    dataZoom: xAxisData.length > 10 ? [
      // {
      //   type: 'inside',
      //   start: 0,
      //   end: 10
      // },
      {
        start: 0,
        end: 100,
        height: '14',
        bottom: '20'
      }
    ] : null,
    legend: {
      data: ['挠度值', '挠度/梁长度', '测距长度']
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          formatter: function (value, index) {
            let str = value.split(' ')
            return str[0] + '\n' + str[1];
          }
        },
        // prettier-ignore
        data: xAxisData
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '挠度/梁长度',
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
        name: '测距长度',
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[2]
          }
        },
        // axisLabel: {
        //   formatter: '{value} °'
        // }
      }
    ],
    series: [
      {
        name: '挠度值',
        type: 'line',
        data: seriesData1
      },
      {
        name: '挠度/梁长度',
        type: 'line',
        data: seriesData2
      },
      {
        name: '测距长度',
        type: 'line',
        yAxisIndex: 1,
        data: seriesData3
      },
    ]
  }, true)
}
const initChart2 = (data) => {
  if (!chart1) {
    chart1 = echarts.init(document.querySelector('#chart'));
  }
  if (!data) return
  //按createTime升序排序
  data = JSON.parse(JSON.stringify(data))
  data.sort((a, b) => {
    return a.createTime.localeCompare(b.createTime)
  })
  let xAxisData = [], seriesData1 = [], seriesData2 = []
  data.forEach(e => {
    xAxisData.push(e.createTime)
    seriesData1.push(e.x)
    seriesData2.push(e.y)
  })
  const colors = ['#7299fd', '#43d147'];
  chart1.setOption({
    color: colors,
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      // right: '20%'
    },
    dataZoom: xAxisData.length > 10 ? [
      // {
      //   type: 'inside',
      //   start: 0,
      //   end: 10
      // },
      {
        start: 0,
        end: 100,
        height: '14',
        bottom: '20'
      }
    ] : null,
    legend: {
      data: ['x轴', 'y轴']
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          formatter: function (value, index) {
            let str = value.split(' ')
            return str[0] + '\n' + str[1];
          }
        },
        // prettier-ignore
        data: xAxisData
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '倾角',
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
      // {
      //   type: 'value',
      //   name: 'y轴',
      //   position: 'right',
      //   alignTicks: true,
      //   axisLine: {
      //     show: true,
      //     lineStyle: {
      //       color: colors[1]
      //     }
      //   },
      //   axisLabel: {
      //     formatter: '{value} °'
      //   }
      // }
    ],
    series: [
      {
        name: 'x轴',
        type: 'line',
        data: seriesData1
      },
      {
        name: 'y轴',
        type: 'line',
        // yAxisIndex: 1,
        data: seriesData2
      }
    ]
  }, true)
}
const _getProjectDeviceList = (id) => {
  let data = {
    pid: id,
    status: '',
    pageNum: 1,
    pageSize: 9999
  }
  getProjectDeviceList(data).then(res => {
    if (res.code == 200) {
      options_device.value = res.data.rows
      let did = route.query.did
      let hasin = null
      if (did) {
        hasin = options_device.value.find(e => {
          return e.did == did
        })
      } else {
        //找出一个在线的设备,设为默认值
        hasin = options_device.value.find(e => {
          if (e.trussDevices && e.trussDevices.onlineStatus == '在线') {
            return true
          }
        })
      }
      if (hasin) {
        device.value = hasin.did
      } else {
        device.value = options_device.value[0]?.did
      }
    }
  })
}
const _getDataReport = () => {
  let data = {
    pid: currentProject.value.id,
    did: device.value,
    startTime: date.value[0],
    endTime: date.value[1],
  }
  getDataReport(data).then(async res => {
    if (res.code == 200) {
      tableData.value = res.data
      if (res.data.length > 0) {
        if (res.data[0].type == '激光测距仪') {
          await nextTick()
          initChart1(res.data)
        } else {
          await nextTick()
          initChart2(res.data)
        }
      }
    }
  })
}

watch(currentProject, (val) => {
  if (val && val.id) {
    _getProjectDeviceList(val.id)
  }
}, { immediate: true })
watch([device, date], (val) => {
  if (val[0] && val[1][0] && val[1][1]) {
    _getDataReport()
  }
}, { immediate: true })
const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}
let tableData = ref([])
let doSearch = () => {
  _getDataReport()
}
let doReset = () => {
  console.log('data', date.value);
}
// onBeforeMount()(async () => {
//   let did = route.query.did
//   console.log('111111', did);
//   if (did) {
//     device.value = did
//   }
// })
onMounted(async () => {
  // let did = route.query.did
  // console.log('111111', did);
  // if (did) {
  //   device.value = did
  // }
})

</script>
<style lang='scss' scoped>
:deep(.datepicker) {
  width: 320px;
  flex-grow: initial;
}

:deep(.el-table th.el-table__cell>.cell) {
  color: #000;
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

  .button {
    border-radius: 4px;
    width: 100px;
    height: 32px;

    &.ok {
      background-color: #000;
      color: #fff;
    }
  }
}

.chart-wrap {
  height: 400px;
  width: calc(100% - 20px);
  position: relative;
}

#chart {
  height: 400px;
  position: relative;
  opacity: 0;

  &.show {
    opacity: 1;
  }
}

.empty {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  color: #999;
  height: 60px;
  font-size: 14px;
  line-height: 60px;
  text-align: center;
}
</style>