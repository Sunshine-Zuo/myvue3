<template>
  <div class="tags" v-if="showTags">
    <div class="item-wrapper">
      <div class="item" v-for="(item, index) in tagsList" :class="{ 'active': isActive(item.path) }" :key="index">
        <router-link :to="item.path" class="tags-title">{{ item.title }}</router-link>
        <el-icon @click="closeTags(index)">
          <CloseBold />
        </el-icon>
      </div>
    </div>
    <div class="tags-close-box">
      <el-dropdown @command="handleCommand">
        <el-button class="button" size="small" type="primary">
          标签选项
          <el-icon class="icon">
            <ArrowDownBold />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { CloseBold, ArrowDownBold } from '@element-plus/icons-vue'
import { computed } from "vue";
import { useStore } from "vuex";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
export default {
  components: { CloseBold, ArrowDownBold },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isActive = (path) => {
      return path === route.fullPath;
    };
    const store = useStore();
    const tagsList = computed(() => store.state.tagsList);
    const showTags = computed(() => tagsList.value.length > 0);
    // 关闭单个标签
    const closeTags = (index) => {
      const delItem = tagsList.value[index];
      store.commit("delTagsItem", { index });
      const item = tagsList.value[index]
        ? tagsList.value[index]
        : tagsList.value[index - 1];
      if (item) {
        delItem.path === route.fullPath && router.push(item.path);
      } else {
        router.push("/");
      }
    };
    // 添加标签
    const addTags = (route) => {
      const index = tagsList.value.findIndex((item) => {
        return item.path.split("?")[0] === route.path;
      });
      if (index > -1) {
        store.commit("replaceTagsItem", {
          index: index, item: {
            name: route.name,
            title: route.meta.title,
            path: route.fullPath,
          }
        });
      } else {
        if (tagsList.value.length >= 8) {
          store.commit("delTagsItem", { index: 0 });
        }
        store.commit("addTagsItem", {
          name: route.name,
          title: route.meta.title,
          path: route.fullPath,
        });
      }
    };
    addTags(route);
    onBeforeRouteUpdate((to) => {
      addTags(to);
    });
    // 关闭全部标签
    const closeAll = () => {
      store.commit("clearTags");
      // router.push("/");
    };
    // 关闭其他标签
    const closeOther = () => {
      const curItem = tagsList.value.filter((item) => {
        return item.path === route.fullPath;
      });
      store.commit("closeTagsOther", curItem);
    };
    const handleCommand = (command) => {
      command === "other" ? closeOther() : closeAll();
    }
    return {
      isActive,
      tagsList,
      showTags,
      closeTags,
      handleCommand
    }
  }
}
</script>
<style lang="scss" scoped>
.tags {
  position: sticky;
  top: 0;
  height: 30px;
  overflow: hidden;
  background: #fff;
  padding-right: 120px;
  box-shadow: 0 5px 10px #ddd;
}

.item-wrapper {
  width: 100%;
  height: 100%;
  @include flex(flex-start);

  .item {
    border-radius: 3px;
    font-size: 12px;
    color: #666;
    margin: 0 3px;
    cursor: pointer;
    height: 24px;
    border: 1px solid #e9eaec;
    background: #fff;
    padding: 0 5px 0 12px;
    @include flex();

    &.active {
      color: #fff;
      background-color: #6cb0a3;

      .tags-title {
        color: #fff;
      }
    }

    .tags-title {
      color: #666;
      margin-right: 5px;
    }
  }
}

.tags-close-box {
  position: absolute;
  right: 5px;
  top: 0;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;

  .button {
    width: 110px;
    height: 30px;

    .icon {
      margin-left: 5px;
    }
  }
}
</style>