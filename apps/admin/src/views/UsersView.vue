<template>
  <div class="users-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">
          <i class="i-ep-user-filled mr-2" />系统用户
        </h2>
        <p class="page-subtitle">统一管理系统账号，支持新增、编辑、删除</p>
      </div>
      <el-button type="primary" @click="openCreateDialog">
        <i class="i-ep-plus mr-1" />新增用户
      </el-button>
    </div>

    <el-card class="table-card">
      <div class="toolbar">
        <el-input
          v-model="query.keyword"
          class="search-input"
          clearable
          placeholder="搜索用户名或昵称"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        >
          <template #prefix>
            <i class="i-ep-search" />
          </template>
        </el-input>
        <div class="toolbar-actions">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
      </div>

      <el-table :data="users" v-loading="loading" stripe max-height="calc(100vh - 360px)">
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
        <el-table-column prop="createdAt" label="创建时间">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          :current-page="query.page"
          :page-size="query.pageSize"
          :total="query.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新增用户' : '编辑用户'"
      width="520px"
      append-to-body
      align-center
      destroy-on-close
      class="user-dialog"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item :label="dialogMode === 'create' ? '密码' : '新密码'" prop="password">
          <el-input
            v-model="form.password"
            placeholder="编辑时不填则不修改"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="ADMIN" />
            <el-option label="操作员" value="OPERATOR" />
            <el-option label="审计员" value="AUDITOR" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">
          {{ dialogMode === 'create' ? '创建' : '保存' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { createUserApi, deleteUserApi, updateUserApi, usersApi, type UserItem } from '../api/auth';

type Role = 'ADMIN' | 'OPERATOR' | 'AUDITOR';

const users = ref<UserItem[]>([]);
const loading = ref(false);
const submitLoading = ref(false);
const dialogVisible = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');
const editingId = ref<number | null>(null);
const formRef = ref<FormInstance>();

const query = reactive({
  keyword: '',
  page: 1,
  pageSize: 10,
  total: 0,
});

const form = reactive({
  username: '',
  password: '',
  nickname: '',
  role: 'OPERATOR' as Role,
});

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3位', trigger: 'blur' },
  ],
  password: [
    {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (dialogMode.value === 'create' && (!value || value.length < 6)) {
          callback(new Error('密码至少6位'));
          return;
        }
        if (dialogMode.value === 'edit' && value && value.length < 6) {
          callback(new Error('密码至少6位'));
          return;
        }
        callback();
      },
      trigger: 'blur',
    },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
};

async function loadUsers() {
  try {
    loading.value = true;
    const res = await usersApi({
      page: query.page,
      pageSize: query.pageSize,
      keyword: query.keyword || undefined,
    });
    users.value = res.list;
    query.total = res.total;

    // 删除最后一条数据后自动回退到上一页
    if (users.value.length === 0 && query.page > 1) {
      query.page -= 1;
      await loadUsers();
    }
  } catch {
    ElMessage.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.username = '';
  form.password = '';
  form.nickname = '';
  form.role = 'OPERATOR';
  editingId.value = null;
  formRef.value?.clearValidate();
}

function openCreateDialog() {
  dialogMode.value = 'create';
  resetForm();
  dialogVisible.value = true;
}

function handleSearch() {
  query.page = 1;
  loadUsers();
}

function handleReset() {
  query.keyword = '';
  query.page = 1;
  query.pageSize = 10;
  loadUsers();
}

function handleCurrentChange(page: number) {
  query.page = page;
  loadUsers();
}

function handleSizeChange(size: number) {
  query.page = 1;
  query.pageSize = size;
  loadUsers();
}

function openEditDialog(user: UserItem) {
  dialogMode.value = 'edit';
  resetForm();
  editingId.value = user.id;
  form.username = user.username;
  form.nickname = user.nickname || '';
  form.role = user.role;
  dialogVisible.value = true;
}

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  try {
    submitLoading.value = true;
    if (dialogMode.value === 'create') {
      await createUserApi({
        username: form.username,
        password: form.password,
        nickname: form.nickname || undefined,
        role: form.role,
      });
      ElMessage.success('用户创建成功');
    } else if (editingId.value) {
      await updateUserApi(editingId.value, {
        username: form.username,
        password: form.password || undefined,
        nickname: form.nickname || undefined,
        role: form.role,
      });
      ElMessage.success('用户更新成功');
    }

    dialogVisible.value = false;
    await loadUsers();
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '操作失败');
  } finally {
    submitLoading.value = false;
  }
}

async function handleDelete(user: UserItem) {
  try {
    await ElMessageBox.confirm(`确认删除用户 ${user.username} 吗？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    });

    await deleteUserApi(user.id);
    ElMessage.success('删除成功');
    await loadUsers();
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return;
    ElMessage.error(error?.response?.data?.message || '删除失败');
  }
}

function formatDate(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

loadUsers();
</script>

<style lang="scss" scoped>
.users-page {
  @include fade-in-up;
}

.page-header {
  @include flex-between;
  margin-bottom: $spacing-md;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  border-radius: $radius-lg;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.10), rgba(148, 163, 184, 0.08));
}

.page-title {
  display: flex;
  align-items: center;
  margin: 0 0 4px;
  font-size: $text-xl;
  font-weight: 700;
  color: $color-text-base;
}

.page-subtitle {
  margin: 0;
  color: $color-text-muted;
  font-size: $text-sm;
}

.table-card {
  border-radius: $radius-xl !important;
  overflow: hidden;

  :deep(.el-card__body) { padding: $spacing-md; }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
  }

  .search-input {
    width: min(420px, 100%);
  }

  .toolbar-actions {
    display: flex;
    gap: $spacing-sm;
    flex-shrink: 0;
  }

  :deep(.el-table) {
    width: 100%;
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: $radius-md;
  }

  :deep(.el-table th) {
    background: $color-bg-body;
    color: $color-text-muted;
    font-size: $text-sm;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  :deep(.el-table td),
  :deep(.el-table th) {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .pagination-wrap {
    display: flex;
    justify-content: flex-end;
    margin-top: $spacing-md;
  }
}

@media (max-width: 768px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header :deep(.el-button) {
    width: 100%;
  }

  .table-card {
    :deep(.el-card__body) {
      padding: $spacing-sm;
    }

    .toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .search-input {
      width: 100%;
    }

    .toolbar-actions {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .pagination-wrap {
      justify-content: center;
      overflow-x: auto;
    }
  }
}
</style>

<style lang="scss">
.user-dialog .el-dialog {
  max-width: calc(100vw - 24px);
  border-radius: 14px;
}

.user-dialog .el-dialog__body {
  padding-top: 10px;
}
</style>
