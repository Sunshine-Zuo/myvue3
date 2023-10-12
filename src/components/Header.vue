<template>
  <div class="header">
    <!-- <div class="collapse-btn" @click="changeCollapse">
      <el-icon v-if="collapse">
        <Fold />
      </el-icon>
      <el-icon v-else>
        <Expand />
      </el-icon>
    </div> -->
    <!-- <el-button v-if="showBack" round @click="goback">
      <el-icon class="el-icon--left">
        <ArrowLeftBold />
      </el-icon>返回
    </el-button> -->
    <div class="title">XXXX系统</div>
    <el-popover placement="bottom" :width="400" trigger="click" v-model:visible="headerPopoverVisible" :teleported=false>
      <template #reference>
        <div class="project " v-show="showProjectSelect" @click="doClick()">
          <img class="project-icon" src="../assets/img/icon07.png" alt="">
          <div class="project-name">{{ currentProject && currentProject.name }}</div>
          <el-icon class="arrow-down">
            <ArrowDownBold />
          </el-icon>
        </div>
      </template>
      <div class="project-dropdown">
        <el-input v-model="inputtxt" class="searchname" placeholder="请输入项目名称">
          <template #prefix>
            <el-icon class="el-input__icon">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <div class="add-wrap">
          <div class="label">位置筛选：</div>
          <el-select v-model="select1" class="m-select" placeholder="Select" :teleported="false">
            <el-option v-for="item in select1options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="select2" class="m-select ml-10" placeholder="Select" :teleported="false">
            <el-option v-for="item in select2options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="pro-wrap">
          <!-- <div class="wrap1">
            <div class="title">所有项目</div>
            <div class="desc">20个</div>
          </div> -->
          <div class="hr"></div>
          <div class="wrap2">
            <div class="title">正常项目</div>
            <div class="desc">{{ projectList1.length }}个</div>
          </div>
          <div class="pro-item" @click="changeCurrentProject(item)" v-if="projectList1.length > 0"
            v-for="item in projectList1" :key="item.id">
            {{ item.name }}</div>
          <div class="hr"></div>
          <div class="wrap3">
            <div class="title">停用项目</div>
            <div class="desc">{{ projectList2.length }}个</div>
          </div>
          <div class="pro-item" @click="changeCurrentProject(item)" v-if="projectList2.length > 0"
            v-for="item in projectList2" :key="item.id">
            {{ item.name }}</div>
        </div>
      </div>
    </el-popover>
    <el-dropdown style="flex: 1;display: flex;justify-content: flex-end;">
      <div class="userinfo">
        {{ userinfo.name }}
        <el-icon>
          <CaretBottom />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script>
import { Expand, Fold, CaretBottom, ArrowLeftBold, ArrowDownBold, Search } from '@element-plus/icons-vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import pcC from "@/assets/map/pc-code.json"
import { getProjectList } from "@/utils/api.js";
export default {
  components: { Expand, Fold, CaretBottom, ArrowLeftBold, ArrowDownBold, Search },
  setup() {

    const store = useStore();
    const router = useRouter();
    const collapse = computed(() => store.state.collapse);
    const showBack = computed(() => store.state.showBack);
    let userinfo = computed(() => store.state.userinfo);
    const showProjectSelect = computed(() => store.state.showProjectSelect);
    const currentProject = computed(() => store.state.currentProject);
    const projectList = computed(() => store.state.projectList);
    const headerPopoverVisible = computed(() => store.state.headerPopoverVisible);

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
    let pcCV = pcC.map(e => {
      let child = e.children.map(c => {
        return { ...c, value: c.code, label: c.name }
      })
      return { ...e, value: e.code, label: e.name, children: child }
    })

    const doClick = () => {
      store.commit("setHeaderPopoverVisible", true);
    }
    let inputtxt = ref('')
    let select1 = ref('0')
    let select2 = ref('0')
    let select1options = ref([])
    let select2options = ref([])
    select1options.value = [{ value: '0', label: '全部省份' }, ...pcCV]
    watch(select1, (val) => {
      if (val === '0') {
        select2options.value = [{ value: '0', label: '全部城市' }]
      } else {
        let qu = select1options.value.find(e => {
          return e.code === select1.value
        })
        select2options.value = [{ value: '0', label: '全部城市' }, ...qu.children]
      }
      select2.value = '0'
    }, { immediate: true })
    const _getProjectList = async () => {
      let res = await getProjectList({
        pageNum: 1,
        pageSize: 9999
      })
      let projectList = []
      if (res.code == 200) {
        projectList = res.data.rows
        store.commit("setProjectList", projectList);
      }
      let currentProject = JSON.parse(localStorage.getItem('currentProject'))
      if (currentProject) {
        currentProject = projectList.find(e => {
          return e.id === currentProject.id
        })
      }
      if (currentProject) {
        store.commit("setCurrentProject", currentProject);
      } else {
        store.commit("setCurrentProject", projectList[0]);
      }

    }
    onMounted(() => {
      if (!userinfo.value) {
        userinfo.value = JSON.parse(localStorage.getItem('userinfo')) || {}
      }
      _getProjectList()
    })
    const changeCurrentProject = (item) => {
      localStorage.setItem('currentProject', JSON.stringify(item))
      store.commit("setCurrentProject", item);
      store.commit("setHeaderPopoverVisible", false);
    }
    //符合筛选条件的正常项目
    let projectList1 = computed(() => {
      let list = projectList.value.filter(e => {
        if (select1.value !== '0' && codeToText[select1.value] !== e.province) {
          return false
        }
        if (select2.value !== '0' && codeToText[select2.value] !== e.city) {
          return false
        }
        return e.name.includes(inputtxt.value) && e.projectStatus === '正常'
      })
      return list
    });
    //符合筛选条件的停用项目
    let projectList2 = computed(() => {
      let list = projectList.value.filter(e => {
        if (select1.value !== '0' && codeToText[select1.value] !== e.province) {
          return false
        }
        if (select2.value !== '0' && codeToText[select2.value] !== e.city) {
          return false
        }
        return e.name.includes(inputtxt.value) && e.projectStatus !== '正常'
      })
      return list
    });

    watch(showProjectSelect, (val) => {
      if (val) {
        _getProjectList()
      }
    })
    const changeCollapse = () => {
      store.commit("changeCollapse", !collapse.value);
    }
    const logout = () => {
      store.commit("setUserinfo", {});
      router.push("/login");
    }
    const goback = () => {
      router.go(-1)
    }
    return {
      headerPopoverVisible,
      inputtxt,
      select1,
      select2,
      select1options,
      select2options,
      collapse,
      userinfo,
      showBack,
      showProjectSelect,
      changeCollapse,
      logout,
      goback,
      projectList1,
      projectList2,
      currentProject,
      changeCurrentProject,
      doClick
    }
  }
}

</script>

<style scoped lang="scss">
.project-dropdown {
  .add-wrap {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .label {
      flex: 1;
    }

    .m-select {
      width: 140px;
    }
  }

  .pro-wrap {
    margin-top: 10px;

    .hr {
      margin: 10px 0;
      border-bottom: solid 1px #eee;
    }

    .pro-item {
      padding-left: 20px;
      margin: 10px 0;
      cursor: pointer;

      &:hover {
        background-color: #eee;
      }
    }

    .wrap1,
    .wrap2,
    .wrap3 {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 18px;
        font-weight: bold;
        color: #000;
      }
    }
  }
}

.project {
  margin-left: 30px;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 16px;
  cursor: pointer;

  .project-icon {
    width: 24px;
    height: 24px;
  }

  .project-name {
    margin-left: 10px;
  }

  .arrow-down {
    margin-left: 4px;
  }
}

.header {
  position: relative;
  width: 100%;
  height: 50px;
  font-size: 22px;
  color: #fff;
  background-color: #000;
  @include flex(space-between);
  padding: 0 20px;

  .collapse-btn {
    padding: 0 20px;
    cursor: pointer;
    @include flex();
  }

  // .title {
  //   flex: 1;
  // }


  .userinfo {
    color: #fff;
    font-size: 22px;
    @include flex();
  }
}
</style>
