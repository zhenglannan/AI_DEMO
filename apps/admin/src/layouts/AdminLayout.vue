<template>
  <div class="admin-shell">
    <aside class="side-panel">
      <div class="brand">Nova Admin</div>
      <el-menu :default-active="activePath" router class="menu-panel">
        <el-menu-item index="/dashboard">
          <i class="i-ep-odometer mr-2" />
          仪表盘
        </el-menu-item>
        <el-menu-item index="/users">
          <i class="i-ep-user mr-2" />
          用户管理
        </el-menu-item>
      </el-menu>
    </aside>

    <main class="content-panel">
      <header class="top-bar">
        <span class="text-sm text-gray-500 font-medium">现代化后台管理系统</span>
        <el-dropdown>
          <span class="user-name">
            <i class="i-ep-user-filled mr-1" />
            {{ authStore.user.nickname || authStore.user.username || '管理员' }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">
                <i class="i-ep-switch-button mr-1" />退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </header>

      <section class="view-panel">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const activePath = computed(() => route.path);

onMounted(async () => {
  if (!authStore.user.username) {
    await authStore.fetchMe();
  }
});

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style lang="scss" scoped>
.admin-shell {
  display: grid;
  grid-template-columns: $sidebar-width 1fr;
  min-height: 100vh;
}

.side-panel {
  padding: $spacing-lg $spacing-md;
  background: linear-gradient(180deg, $color-sidebar 0%, $color-sidebar-hover 100%);
  color: $color-sidebar-text;
  @include scrollbar;

  .brand {
    font-size: $text-2xl;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: $spacing-lg;
    padding: 0 $spacing-sm;
  }

  .menu-panel {
    border-right: none !important;
    background: transparent !important;

    :deep(.el-menu-item) {
      color: rgba($color-sidebar-text, 0.75);
      border-radius: $radius-md;
      margin-bottom: $spacing-xs;
      transition: all $transition-fast;

      &.is-active,
      &:hover {
        color: $color-sidebar-text;
        background-color: rgba(255, 255, 255, 0.10) !important;
      }
    }
  }
}

.content-panel {
  display: flex;
  flex-direction: column;
  padding: $spacing-lg;
  overflow: hidden;
}

.top-bar {
  @include flex-between;
  @include glass-card(8px, rgba(255, 255, 255, 0.85));
  padding: 0 $spacing-lg;
  height: $topbar-height;
  flex-shrink: 0;
}

.user-name {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  font-size: $text-md;
  color: $color-text-base;
  transition: color $transition-fast;

  &:hover { color: $color-primary; }
}

.view-panel {
  flex: 1;
  margin-top: $spacing-lg;
  overflow: auto;
  @include scrollbar;
}

@include mobile {
  .admin-shell {
    grid-template-columns: 1fr;
  }

  .side-panel { display: none; }
}
</style>
