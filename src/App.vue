<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from "vuex";
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
let locale = ref({})
locale.value = zhCn
const store = useStore();
const headerPopoverVisible = computed(() => store.state.headerPopoverVisible);
onMounted(() => {
  let userinfo = JSON.parse(localStorage.getItem('userinfo'))
  store.commit("setUserinfo", userinfo);
  document.getElementById('app').addEventListener('click', (e) => {
    let dom1 = document.querySelector('.el-tooltip__trigger')
    let dom2 = document.querySelector('.el-popover')
    if (dom1 && dom2) {
      if (!(dom1.contains(e.target) || dom2.contains(e.target))) {
        store.commit("setHeaderPopoverVisible", false);
      }
    }
  })
})
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #eee;
}

::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;

  &:hover {
    background-color: #a8a8a8;
  }

  &:active {
    background-color: #787878;
  }
}

::-webkit-scrollbar-corner {
  background-color: #eee;
}

* {
  margin: 0;
  padding: 0;
  //兼容火狐
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #eee;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'PingFang SC', "Helvetica Neue", Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
}

a {
  text-decoration: none
}

div {
  box-sizing: border-box;
}

img {
  display: block;
}

.ml-10 {
  margin-left: 10px;
}

.ml-20 {
  margin-left: 20px;
}

.mr-10 {
  margin-right: 10px;
}

.mr-20 {
  margin-right: 20px;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}

.cursor-pointer {
  cursor: pointer;
}

.pointer-none {
  pointer-events: none;
}

.color-green {
  color: #42d048;
}

.color-red {
  color: #f44040;
}

.button {
  border: solid 1px #ddd;
  background-color: #fff;
  min-width: 100px;
  padding: 0 20px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  animation: throttle 1s step-end forwards;

  &.current {
    background-color: #000;
    color: #fff;
  }

  &+.button {
    margin-left: 20px;
  }

  &:active {
    animation: none;
  }

  @keyframes throttle {
    from {
      pointer-events: none;
    }

    to {
      pointer-events: all;
    }
  }
}
</style>
