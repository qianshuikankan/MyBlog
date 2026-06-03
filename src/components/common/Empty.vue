<script setup lang="ts">
defineProps<{ description?: string }>()
</script>

<template>
  <el-empty :description="description || '暂无数据'">
    <template #image>
      <el-icon :size="60" color="#c0c4cc">
        <Folder />
      </el-icon>
    </template>
  </el-empty>
</template>
