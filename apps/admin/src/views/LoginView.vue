<template>
  <div class="login-page">
    <div class="login-card">
      <div class="flex-center mb-2">
        <i class="i-ep-cpu text-4xl text-primary-500" />
      </div>
      <h1 class="login-title">Nova Admin</h1>
      <p class="login-subtitle">面向现代企业的高可用后台系统</p>
      <el-form :model="form" @submit.prevent="submit" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" size="large" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password size="large" />
        </el-form-item>
        <el-button type="primary" class="login-btn" size="large" :loading="loading" @click="submit">登录</el-button>
      </el-form>
      <p class="hint"><i class="i-ep-info-filled mr-1" />默认账号: admin / admin123456</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const form = reactive({
  username: 'admin',
  password: 'admin123456',
});

async function submit() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码');
    return;
  }

  try {
    loading.value = true;
    await authStore.login(form.username, form.password);
    ElMessage.success('登录成功');
    router.push('/dashboard');
  } catch {
    ElMessage.error('登录失败，请检查账号密码');
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  @include flex-center;
  min-height: 100vh;
  background: conic-gradient(from 140deg at 20% 20%, #dbeafe, #cffafe, #fef3c7, #dbeafe);
}

.login-card {
  @include glass-card;
  @include fade-in-up;
  width: min(92vw, 430px);
  padding: $spacing-xl;

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: $color-text-muted;
  }
}

.login-title {
  margin: $spacing-xs 0 0;
  font-size: $text-3xl;
  font-weight: 800;
  color: $color-text-base;
  text-align: center;
}

.login-subtitle {
  color: $color-text-muted;
  font-size: $text-md;
  text-align: center;
  margin: $spacing-xs 0 $spacing-lg;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: $text-lg;
  font-weight: 600;
  border-radius: $radius-md !important;
}

.hint {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: $spacing-md;
  color: $color-text-hint;
  font-size: $text-sm;
}
</style>
