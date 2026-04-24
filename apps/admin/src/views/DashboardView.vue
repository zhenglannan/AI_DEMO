<template>
  <div class="grid-cards">
    <el-card class="metric-card">
      <div class="metric-title">当前用户</div>
      <div class="metric-value">{{ authStore.user.nickname || authStore.user.username || '-' }}</div>
    </el-card>
    <el-card class="metric-card">
      <div class="metric-title">角色</div>
      <div class="metric-value">{{ authStore.user.role || '-' }}</div>
    </el-card>
    <el-card class="metric-card">
      <div class="metric-title">系统状态</div>
      <div class="metric-value">Healthy</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>
