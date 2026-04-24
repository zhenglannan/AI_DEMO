<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">Nova Admin</h1>
      <p class="login-subtitle">面向现代企业的高可用后台系统</p>
      <el-form :model="form" @submit.prevent="submit" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-button type="primary" class="login-btn" :loading="loading" @click="submit">登录</el-button>
      </el-form>
      <p class="hint">默认账号: admin / admin123456</p>
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
