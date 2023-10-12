<template>
  <div class="dash">
    <div class="title">点位绑定</div>
    <!-- <div class="item">
      <div class="label">选择项目</div>
      <el-select v-model="project" class="m-2" placeholder="请选择绑定的项目" style="width: 220px">
        <el-option v-for="item in options_project" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div> -->
    <div class="item">
      <div class="label">上传点位图</div>
      <div class="button" v-if="image" @click="selectimg">
        <el-icon>
          <RefreshRight />
        </el-icon>
        重新上传点位图
      </div>
      <div class="button" v-else @click="selectimg">
        <el-icon>
          <Plus />
        </el-icon>
        上传点位图
      </div>
      <input id="imginput" @change="inputChange" style="display: none;" type="file" accept="image/*">
    </div>
    <div class="main">
      <div class="tip">
        <div class="tip-item"><img src="../../assets/img/icon01.png" alt="">点击设备可进行点位标注</div>
        <div class="tip-item"><img src="../../assets/img/icon02.png" alt="">表示已标注设备</div>
        <div class="tip-item"><el-icon style="font-size:18px;margin-right:4px">
            <Setting />
          </el-icon>点击可对设备进行设置(包括取消点位标注)</div>
      </div>
      <div class="content">
        <div class="left">
          <div class="left-title">设备列表</div>
          <div class="device-wrap">
            <div @click="selectedDevice(item)" class="device"
              :class="{ 'selected': selected_device.id == item.id, 'binding': item.coordinate }"
              v-for="(item, index) in devices" :key="'device' + index">
              <!-- <div class="index">{{ index + 1 }}</div> -->
              <div class="name">{{ item.name }}</div>
              <!-- <img class="delete" @click="removePosition(index)" v-if="item.coordinate" src="../../assets/img/icon03.png"
                alt=""> -->

              <el-popover :width="160" placement="right" popper-style="padding: 10px;" trigger="click">
                <template #reference>
                  <el-icon style="font-size:16px;cursor:pointer;color:#aaa">
                    <Setting />
                  </el-icon>
                </template>
                <template #default>
                  <div class="rich-content">
                    <div class="rich-content-item" @click="handleEdit(index)">
                      <el-icon class="icon" style="font-size:16px;margin-right:10px">
                        <Edit />
                      </el-icon>
                      修改名称
                    </div>
                    <div class="rich-content-item" @click="handleAlarm(item)">
                      <el-icon class="icon" style="font-size:16px;margin-right:10px">
                        <Bell />
                      </el-icon>
                      设置预警参数
                    </div>
                    <div class="rich-content-item" v-if="item.coordinate" @click="removePosition(index)">
                      <img class="img" style="width:16px;display:inline-block;margin-right:10px"
                        src="../../assets/img/icon03.png" alt="">
                      取消点位标注
                    </div>
                  </div>
                </template>
              </el-popover>
            </div>
            <div class="empty" v-if="devices.length == 0">设备列表空</div>
          </div>
        </div>
        <div class="right">
          <div class="img-wrap" @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
            <img @click="doBinding($event)" class="bg-img" :src="image" alt="">
            <template v-for="(item, index) in devices" :key="'point'+index">
              <div v-show="item.coordinate" class="marker-wrap" :style="getMarkerStyle(item)"
                :title="item.trussDevices?.type" @dragover="() => { return true }" @dragenter="() => { return true }">
                <img draggable="true" @dragstart="onDragStart($event, item)" @dragend="onDragEnd" class="marker"
                  src="../../assets/img/icon04.png" alt="">
                <div class="text" :class="{ 'isleft': item.coordinate && item.coordinate.split(',')[0] > 60 }">{{
                  item.name }}</div>
                <!-- <div v-else class="text">{{ index + 1 }}</div> -->
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="editDialogVisible" title="修改名称" width="30%" center>
      <el-input v-model="newName" @input="newName = newName.replace(/\s*/g, '')" placeholder="请输入设备名称" maxlength="20"
        show-word-limit />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="doEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { projectUploadFile, editProject, editProjectDevice, getProjectInfo, getProjectDeviceList } from "@/utils/api.js";
import { Plus, RefreshRight, Setting, Edit, Bell } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { nextTick } from 'vue';
const route = useRoute();
const router = useRouter();
const store = useStore();

const currentProject = computed(() => store.state.currentProject);
const _getProjectInfo = () => {
  let projectId = currentProject.value.id
  getProjectInfo({ id: projectId }).then(res => {
    if (res.code == 200) {
      image.value = res.data.bitmapImg
    }
  })
}
const _getProjectDeviceList = () => {
  let data = {
    pid: currentProject.value.id,
    status: '',
    pageNum: 1,
    pageSize: 9999
  }
  getProjectDeviceList(data).then(res => {
    if (res.code == 200) {
      devices.value = res.data.rows
    }
  })
}
watch(currentProject, (val) => {
  if (val && val.id) {
    _getProjectInfo()
    _getProjectDeviceList()
  }
}, { immediate: true })
onMounted(() => { })
let options_project = ref([
  { value: 'vvv1', label: 'lll1' },
  { value: 'vvv2', label: 'lll2' },
  { value: 'vvv3', label: 'lll3' },
  { value: 'vvv4', label: 'lll4' },
])
let project = ref('')
let image = ref('')
let devices = ref([])
let selected_device = ref({})//左边选中的设备，选中才可以标记点位
let selected_point = ref({})//右边拖拽中的点位
const selectedDevice = (item) => {
  if (selected_device.value.id === item.id) {
    selected_device.value = {}
  } else {
    selected_device.value = item
  }
}
const getMarkerStyle = (item) => {
  let data = {}
  if (item.coordinate) {
    let coordinate = item.coordinate.split(',')
    data.left = coordinate[0] + '%'
    data.top = coordinate[1] + '%'
  }
  return data
}

let editDialogVisible = ref(false)
let newName = ref('')
const handleEdit = () => {
  editDialogVisible.value = true
}
const doEdit = () => {
  if (!newName.value) {
    ElMessage.error("请输入设备名称");
    return
  }
  let data = {
    id: selected_device.value.id,
    name: newName.value
  }
  editProjectDevice(data).then(res => {
    if (res.code == 200) {
      ElMessage.success("操作成功");
      editDialogVisible.value = false
      _getProjectDeviceList()
    }
  })
}
const handleAlarm = (item) => {
  router.push({ path: '/alarmsetting', query: { id: item.id } })
}
const removePosition = (i) => {
  devices.value[i].coordinate = ''
}
const doBinding = (event, point) => {
  if (point) {//右边直接拖拽的
    let wrap = document.querySelector('.img-wrap')
    console.log('DragStartX', DragStartX, DragStartY);
    let x = event.offsetX - DragStartX + 10 > 0 ? event.offsetX - DragStartX + 10 : 0
    let y = event.offsetY - DragStartY + 20 > 0 ? event.offsetY - DragStartY + 20 : 0
    let coordinate = (x / wrap.clientWidth * 100).toFixed(1) + ',' + (y / wrap.clientHeight * 100).toFixed(1)
    let index = devices.value.findIndex(e => {
      return e.id === point.id
    })
    editProjectDevice({ id: point.id, coordinate: coordinate }).then(res => {
      if (res.code == 200) {
        devices.value[index].coordinate = coordinate
        selected_point.value = {}
      }
    })
  } else {
    if (selected_device.value.id) {
      let wrap = document.querySelector('.img-wrap')
      let x = event.offsetX > 0 ? event.offsetX : 0
      let y = event.offsetY > 0 ? event.offsetY : 0
      let coordinate = (x / wrap.clientWidth * 100).toFixed(1) + ',' + (y / wrap.clientHeight * 100).toFixed(1)
      let index = devices.value.findIndex(e => {
        return e.id === selected_device.value.id
      })
      editProjectDevice({ id: selected_device.value.id, coordinate: coordinate }).then(res => {
        if (res.code == 200) {
          devices.value[index].coordinate = coordinate
          selected_device.value = {}
        }
      })
    }
  }
}

let draging = ref(false)//是否拖拽中，拖拽中就将img-wrap里面的其他元素设置为不可放置
let DragStartX = 0, DragStartY = 0//用来计算鼠标在marker上的偏移，使drop时
const onDragStart = (event, item) => {
  DragStartX = event.offsetX
  DragStartY = event.offsetY
  draging.value = true
  selected_point.value = item
}
const onDragEnd = () => {
  draging.value = false
}
const onDrop = (event) => {
  if (event.target.classList.contains('bg-img')) {
    doBinding(event, selected_point.value)
  }
}
const resizeBg = async () => {
  await nextTick()
  let right = document.querySelector('.right')
  let bg = document.querySelector('.bg-img')
  bg.style.maxWidth = (right.clientWidth - 26) + 'px'
  bg.style.maxHeight = (right.clientHeight - 26) + 'px'
}
resizeBg()
window.addEventListener('resize', resizeBg)
const selectimg = () => {
  document.querySelector('#imginput').click()
}
const inputChange = (e) => {
  image.value = window.URL.createObjectURL(e.target.files[0])
  projectUploadFile({ file: e.target.files[0] }).then(res => {
    if (res.code == 200) {
      image.value = res.data.url
      editProject({ id: currentProject.value.id, bitmapImg: res.data.url })
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

.item {
  display: flex;
  align-items: center;

  &+.item {
    margin-top: 20px;
  }

  .label {
    text-align: right;
    width: 100px;
    margin-right: 10px;
  }
}

.button {
  height: 30px;
  color: #aaa;
  font-size: 14px;
}

.main {
  margin-top: 20px;

  .tip {
    display: flex;

    .tip-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #aaa;

      &+.tip-item {
        margin-left: 30px;
      }

      img {
        width: 20px;
        margin-right: 4px;
      }
    }
  }

  .content {
    border: solid 1px #eee;
    height: calc(100vh - 250px);
    min-height: 500px;
    margin-top: 10px;
    display: flex;

    .left {
      width: 240px;

      .left-title {
        background-color: #000;
        color: #fff;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .device-wrap {
        overflow-y: auto;

        .device {
          display: flex;
          align-items: center;
          position: relative;
          font-size: 14px;
          height: 40px;
          border-bottom: solid 1px #eee;
          margin: 0 10px;

          &.binding::before {
            content: '';
            position: absolute;
            height: 70%;
            top: 50%;
            transform: translateY(-50%);
            left: -4px;
            width: 4px;
            background-color: #d4237a;
          }

          &.selected {
            background-color: #eee;
          }

          .index {
            width: 24px;
            text-align: center;
          }

          .name {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 4px;
          }

          .delete {
            width: 20px;
            margin-left: 4px;
          }
        }

        .empty {
          font-size: 14px;
          color: #aaa;
          text-align: center;
          margin-top: 40px;
        }
      }
    }

    .right {
      border-left: solid 1px #eee;
      flex: 1;
      position: relative;
      overflow: auto;

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
          }

          .text {
            white-space: nowrap;
            font-size: 14px;
            background-color: #d4237a;
            color: #fff;
            position: absolute;
            left: 12px;
            top: -16px;
            padding: 0 4px;
            box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);

            &.isleft {
              left: -10px;
              transform: translateX(-100%);
            }

            &:hover {
              z-index: 10;
            }
          }
        }
      }

    }
  }
}

.rich-content {
  .rich-content-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 30px;

    &:hover {
      background-color: #eee;
    }
  }
}
</style>