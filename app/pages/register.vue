<script setup lang="ts">
const { fetchUser } = useAuth()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    // Auto login after register
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    await fetchUser()
    navigateTo('/')
  } catch (err: any) {
    error.value = err.statusMessage || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[100dvh] p-4 bg-gray-50 dark:bg-black">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-black bg-gradient-to-br from-primary-500 to-blue-600 bg-clip-text text-transparent italic mb-2">
          ANTIGRAVITY
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">创建您的账户，开启智能资产管理</p>
      </div>

      <UCard :ui="{ body: 'p-6 md:p-8', rounded: 'rounded-2xl' }">
        <form @submit.prevent="onSubmit" class="space-y-5">
          <UFormField label="邮箱地址">
            <UInput v-model="email" type="email" placeholder="name@example.com" class="w-full" size="lg" />
          </UFormField>
          
          <UFormField label="设置密码">
            <UInput v-model="password" type="password" placeholder="建议至少 6 位字符" class="w-full" size="lg" />
          </UFormField>
          
          <p v-if="error" class="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">{{ error }}</p>
          
          <UButton type="submit" :loading="loading" block size="lg" class="font-bold">
            注 册
          </UButton>
        </form>
        
        <template #footer>
          <div class="text-center text-sm text-gray-500">
            已有账号？
            <NuxtLink to="/login" class="text-primary font-semibold hover:underline">返回登录</NuxtLink>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>