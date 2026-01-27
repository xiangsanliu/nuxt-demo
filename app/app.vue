<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <UApp>
    <nav v-if="user" class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="font-bold">资产管理系统</NuxtLink>
        <NuxtLink to="/" class="text-sm hover:text-primary">我的资产</NuxtLink>
        <NuxtLink to="/transactions" class="text-sm hover:text-primary">操作记录</NuxtLink>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">{{ user.email }}</span>
        <UButton variant="ghost" color="neutral" size="sm" @click="logout">退出</UButton>
      </div>
    </nav>
    <main class="p-4">
      <NuxtPage />
    </main>
  </UApp>
</template>
