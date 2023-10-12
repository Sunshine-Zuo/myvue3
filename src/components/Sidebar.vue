<template>
  <div class="sidebar">
    <el-scrollbar>
      <el-menu :default-active="onRoutes" class="sidebar-el-menu" @select="handleSelect" :collapse="collapse"
        background-color="#f5f5f5" text-color="#5d5d5d" active-text-color="#6cb0a3" router>
        <el-menu-item index="/managedevice">
          <el-icon>
            <TakeawayBox />
          </el-icon><span>设备管理</span>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <Grid />
            </el-icon><span>项目管理</span>
          </template>
          <el-menu-item index="/manageproject">项目管理</el-menu-item>
          <el-menu-item index="/manageprojectdevice">项目设备管理</el-menu-item>
          <el-menu-item index="/pointbinding">项目点位设置</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <Tickets />
            </el-icon><span>项目监测报告</span>
          </template>
          <el-menu-item index="/viewreportoverall">报告总览</el-menu-item>
          <el-menu-item index="/projectalarm">项目预警中心</el-menu-item>
          <el-menu-item index="/viewpoint">点位监测</el-menu-item>
          <el-menu-item index="/viewreport">数据报告</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <Setting />
            </el-icon><span>系统设置</span>
          </template>
          <el-menu-item index="/manageuser">用户管理</el-menu-item>
          <!-- <el-menu-item index="/deviceconfig">设备初始化</el-menu-item> -->
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import {
  House,
  Grid,
  TakeawayBox,
  Tickets,
  Goods,
  Setting,
} from "@element-plus/icons-vue";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  components: {
    House,
    Grid,
    TakeawayBox,
    Tickets,
    Goods,
    Setting,
  },
  setup() {
    const store = useStore();
    const collapse = computed(() => store.state.collapse);
    const handleSelect = (key, keyPath) => {
      // console.log(key, keyPath)
    };
    const route = useRoute();

    const onRoutes = computed(() => {
      return route.path;
    });
    return {
      collapse,
      handleSelect,
      onRoutes,
    };
  },
};
</script>

<style scoped>
:deep(.el-menu-item.is-active) {
  background-color: #daeae7;
}

.sidebar {
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
  /* width: 250px; */
  background-color: #f5f5f5;
  /* border-right: solid 1px #fff; */
}

.sidebar-el-menu {
  border-right: none;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
</style>
