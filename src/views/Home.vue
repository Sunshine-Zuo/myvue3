<template>
  <v-header></v-header>
  <v-sidebar></v-sidebar>
  <div class="content-box" :class="{ 'content-collapse': collapse }">
    <v-tags></v-tags>
    <div class="content" :class="{ 'tag-collapse': showTags }">
      <!-- <keep-alive :include="['managedevice']">
        <router-view></router-view>
      </keep-alive> -->
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
      </router-view>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
import vHeader from "@/components/Header.vue"
import vSidebar from "@/components/Sidebar.vue"
import vTags from "@/components/Tags.vue"
export default {
  components: { vHeader, vSidebar, vTags },
  setup() {
    const store = useStore();
    const collapse = computed(() => store.state.collapse);
    const tagsList = computed(() => store.state.tagsList);
    const showTags = computed(() => tagsList.value.length > 0);
    return {
      collapse,
      showTags
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.content-box {
  position: absolute;
  left: 250px;
  right: 0;
  top: 50px;
  bottom: 0;
  // padding-bottom: 30px;
  background: #fff;
  transition: left .3s ease-in-out;

  &.content-collapse {
    left: 64px;
  }

  .content {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 20px;
    bottom: 20px;
    overflow-y: auto;

    &.tag-collapse {
      top: 40px;
    }
  }
}
</style>