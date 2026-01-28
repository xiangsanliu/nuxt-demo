<script setup lang="ts">
const { fetchUser } = useAuth()
const { t } = useI18n()

useHead({
  title: t('auth.register')
})

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
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t('auth.start') }}</p>
      </div>

      <UCard :ui="{ body: 'p-6 md:p-8', rounded: 'rounded-2xl' }">
        <form @submit.prevent="onSubmit" class="space-y-5">
          <UFormField :label="t('auth.email')">
            <UInput v-model="email" type="email" placeholder="name@example.com" class="w-full" size="lg" />
          </UFormField>
          
          <UFormField :label="t('auth.password')">
            <UInput v-model="password" type="password" class="w-full" size="lg" />
          </UFormField>
          
          <p v-if="error" class="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">{{ error }}</p>
          
          <UButton type="submit" :loading="loading" block size="lg" class="font-bold">
            {{ t('auth.register') }}
          </UButton>
        </form>
        
        <template #footer>
          <div class="text-center text-sm text-gray-500">
            {{ t('auth.hasAccount') }}
            <NuxtLink to="/login" class="text-primary font-semibold hover:underline">{{ t('auth.login') }}</NuxtLink>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>