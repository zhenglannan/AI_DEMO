<template>
  <el-card>
    <template #header>
      <div class="table-title">系统用户</div>
    </template>
    <el-table :data="users" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="createdAt" label="创建时间" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { usersApi } from '@/api/auth';

const users = ref<any[]>([]);
const loading = ref(false);

async function loadUsers() {
  try {
    loading.value = true;
    users.value = await usersApi();
  } catch {
    ElMessage.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
}

onMounted(loadUsers);
</script>
