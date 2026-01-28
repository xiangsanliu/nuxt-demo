<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <UApp>
    <!-- 顶部导航 (桌面端显示导航，移动端仅显示 Logo/退出) -->
    <nav v-if="user" class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <UContainer class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="text-xl font-black bg-gradient-to-r from-primary-500 to-blue-500 bg-clip-text text-transparent">资产管理</NuxtLink>
        
        <!-- 桌面端菜单 -->
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary" active-class="text-primary font-bold">
            <UIcon name="i-lucide-layout-dashboard" /> 资产概览
          </NuxtLink>
          <NuxtLink to="/transactions" class="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary" active-class="text-primary font-bold">
            <UIcon name="i-lucide-history" /> 操作记录
          </NuxtLink>
          <NuxtLink to="/settings" class="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary" active-class="text-primary font-bold">
            <UIcon name="i-lucide-settings" /> 设置
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <span class="hidden lg:inline text-xs text-gray-500 font-mono">{{ user.email }}</span>
          <UButton variant="soft" color="neutral" size="sm" @click="logout" icon="i-lucide-log-out">退出</UButton>
        </div>
      </UContainer>
    </nav>

    <!-- 内容区域 -->
    <main class="pb-24 md:pb-8 p-4">
      <NuxtPage />
    </main>

    <!-- 移动端底部导航栏 (仅移动端显示) -->
    <div v-if="user" class="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <div class="flex justify-around items-center p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl">
        <NuxtLink to="/" class="flex flex-col items-center gap-1 px-4 py-1" active-class="text-primary">
          <UIcon name="i-lucide-layout-dashboard" class="text-xl" />
          <span class="text-[10px] font-medium">资产</span>
        </NuxtLink>
        <NuxtLink to="/transactions" class="flex flex-col items-center gap-1 px-4 py-1" active-class="text-primary">
          <UIcon name="i-lucide-history" class="text-xl" />
          <span class="text-[10px] font-medium">记录</span>
        </NuxtLink>
        <NuxtLink to="/settings" class="flex flex-col items-center gap-1 px-4 py-1" active-class="text-primary">
          <UIcon name="i-lucide-settings" class="text-xl" />
          <span class="text-[10px] font-medium">设置</span>
        </NuxtLink>
      </div>
    </div>
  </UApp>
</template>
