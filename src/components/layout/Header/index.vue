<template>
  <header>
    <div class="left-box">
      <!-- 收缩按钮 -->
      <div class="menu-icon" @click="opendStateChange">
        <remix-icon :size="20" :icon="isCollapse ? 'indent-decrease' : 'indent-increase'"></remix-icon>
      </div>
      <!-- <Breadcrumb /> -->
    </div>
    <div class="right-box">
      <!-- 快捷功能按钮 -->
      <div class="function-list">
        <!-- <div class="function-list-item hidden-sm-and-down"><Full-screen /></div> -->
        <!-- <div class="function-list-item"><SizeChange /></div> -->
        <!-- <div class="function-list-item hidden-sm-and-down"><Theme /></div> -->
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :size="25" :src="userInfo?.avatar" style="margin-right: 5px"></el-avatar>
            {{ userInfo?.account || 'admin' }}
            <remix-icon :size="18" :icon="'arrow-down-s-line'"></remix-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item @click="showPasswordLayer">修改密码</el-dropdown-item> -->
              <el-dropdown-item @click="loginOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- <password-layer :layer="layer" v-if="layer.show" /> -->
    </div>
  </header>
</template>

<script lang="ts">
import RemixIcon from '@/components/remixicon/index.vue'
import { defineComponent, computed, reactive } from 'vue'
import { useAppStore, useAdminStore } from '@/store'
// import { useRouter, useRoute } from 'vue-router'
// import FullScreen from './functionList/fullscreen.vue'
// import SizeChange from './functionList/sizeChange.vue'
// import Theme from './functionList/theme.vue'
// import Breadcrumb from './Breadcrumb.vue'
// import PasswordLayer from './passwordLayer.vue'
export default defineComponent({
  components: {
    RemixIcon,
    // FullScreen,
    // Breadcrumb,
    // SizeChange,
    // Theme,
    // PasswordLayer,
  },
  setup() {
    const appStore = useAppStore()
    const adminStore = useAdminStore()
    // const router = useRouter()
    // const route = useRoute()
    const layer = reactive({
      show: false,
      showButton: true,
    })

    const isCollapse = computed(() => appStore.isCollapse)
    const userInfo = computed(() => adminStore.userInfo)

    // isCollapse change to hide/show the sidebar
    const opendStateChange = () => {
      appStore.isCollapseChange(!isCollapse.value)
    }

    // login out the system
    const loginOut = () => {
      adminStore.logout()
    }

    const showPasswordLayer = () => {
      layer.show = true
    }
    return {
      isCollapse,
      userInfo,
      layer,
      opendStateChange,
      loginOut,
      showPasswordLayer,
    }
  },
})
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: var(--system-header-background);
  padding-right: 22px;
}
.left-box {
  height: 100%;
  display: flex;
  align-items: center;
  .menu-icon {
    width: 60px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    font-weight: 100;
    cursor: pointer;
    margin-right: 10px;
    &:hover {
      background-color: var(--system-header-item-hover-color);
    }
    i {
      color: var(--system-header-text-color);
    }
  }
}
.right-box {
  display: flex;
  justify-content: center;
  align-items: center;
  .function-list {
    display: flex;
    .function-list-item {
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .user-info {
    margin-left: 20px;
    .el-dropdown-link {
      display: flex;
      align-items: center;
      color: var(--system-header-breadcrumb-text-color);
    }
  }
}
</style>
