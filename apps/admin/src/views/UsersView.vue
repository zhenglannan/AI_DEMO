<template>
  <div class="users-page">
    <div class="page-header">
      <h2 class="page-title">
        <i class="i-ep-user-filled mr-2" />系统用户
      </h2>
    </div>

    <el-card class="table-card">
      <el-table :data="users" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'info'" size="small">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" />
      </el-table>
    </el-card>
  </div>
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

<style lang="scss" scoped>
.users-page { @include fade-in-up; }

.page-header {
  @include flex-between;
  margin-bottom: $spacing-md;
}

.page-title {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: $text-xl;
  font-weight: 700;
  color: $color-text-base;
}

.table-card {
  border-radius: $radius-xl !important;

  :deep(.el-card__body) { padding: 0; }

  :deep(.el-table th) {
    background: $color-bg-body;
    color: $color-text-muted;
    font-size: $text-sm;
  }
}
</style>
