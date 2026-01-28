<script setup lang="ts">
const { user, logout } = useAuth()

useHead({
  title: '智能资产管理'
})
</script>

<template>
  <UApp>
    <!-- 顶部导航 -->
    <nav v-if="user" class="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
      <UContainer class="flex justify-between items-center h-16 md:h-20">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter bg-gradient-to-br from-primary-500 to-blue-600 bg-clip-text text-transparent">
          资产管理
        </NuxtLink>
        
        <!-- 桌面端菜单 -->
        <div class="hidden md:flex items-center gap-10">
          <NuxtLink to="/" class="flex items-center gap-2 text-[13px] uppercase tracking-widest transition-opacity hover:opacity-70" active-class="text-primary font-bold">
            资产
          </NuxtLink>
          <NuxtLink to="/transactions" class="flex items-center gap-2 text-[13px] uppercase tracking-widest transition-opacity hover:opacity-70" active-class="text-primary font-bold">
            记录
          </NuxtLink>
          <NuxtLink to="/settings" class="flex items-center gap-2 text-[13px] uppercase tracking-widest transition-opacity hover:opacity-70" active-class="text-primary font-bold">
            设置
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <span class="hidden lg:inline text-[10px] text-gray-400 font-mono uppercase tracking-tighter">{{ user.email }}</span>
          <UButton variant="ghost" color="neutral" size="sm" @click="logout" icon="i-lucide-log-out" class="opacity-50 hover:opacity-100" />
        </div>
      </UContainer>
    </nav>

    <!-- 内容区域 - 移除 p-4 确保对齐 -->
    <main class="pb-28 md:pb-12">
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

<style>
/**
 * 防止 iOS 端点击输入框页面自动放大
 * 触发条件：输入框字号小于 16px
 */
@media screen and (max-width: 768px) {
  input, select, textarea {
    font-size: 16px !important;
  }
}
</style>
