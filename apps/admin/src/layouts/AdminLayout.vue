<template>
  <div class="admin-shell">
    <aside class="side-panel">
      <div class="brand">Nova Admin</div>
      <el-menu :default-active="activePath" router class="menu-panel">
        <el-menu-item index="/dashboard">仪表盘</el-menu-item>
        <el-menu-item index="/users">用户管理</el-menu-item>
      </el-menu>
    </aside>

    <main class="content-panel">
      <header class="top-bar">
        <div>现代化后台管理系统</div>
        <el-dropdown>
          <span class="user-name">{{ authStore.user.nickname || authStore.user.username || '管理员' }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
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
