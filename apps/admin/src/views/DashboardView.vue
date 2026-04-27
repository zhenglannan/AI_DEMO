<template>
  <div class="dashboard">
    <h2 class="text-xl font-bold text-gray-800 mb-4">欢迎回来，{{ authStore.user.nickname || authStore.user.username || '管理员' }}</h2>
    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-icon bg-blue-50">
          <i class="i-ep-user text-2xl text-blue-500" />
        </div>
        <div class="metric-body">
          <div class="metric-label">当前用户</div>
          <div class="metric-value">{{ authStore.user.nickname || authStore.user.username || '-' }}</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon bg-violet-50">
          <i class="i-ep-avatar text-2xl text-violet-500" />
        </div>
        <div class="metric-body">
          <div class="metric-label">角色</div>
          <div class="metric-value">{{ authStore.user.role || '-' }}</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon bg-green-50">
          <i class="i-ep-circle-check text-2xl text-green-500" />
        </div>
        <div class="metric-body">
          <div class="metric-label">系统状态</div>
          <div class="metric-value text-green-600">Healthy</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
.dashboard { @include fade-in-up; }

.metric-grid {
  display: grid;
  gap: $spacing-md;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.metric-card {
  @include glass-card(8px, rgba(255, 255, 255, 0.9));
  @include hover-lift;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: $radius-lg;
  flex-shrink: 0;
}

.metric-body { flex: 1; }

.metric-label {
  font-size: $text-sm;
  color: $color-text-muted;
  margin-bottom: $spacing-xs;
}

.metric-value {
  font-size: $text-xl;
  font-weight: 700;
  color: $color-text-base;
  @include truncate;
}
</style>
