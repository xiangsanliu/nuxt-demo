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
  <div class="flex flex-col items-center justify-center min-h-screen">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-bold text-center">Register</h1>
      </template>
      
      <form @submit.prevent="onSubmit" class="space-y-4">
        <UFormField label="Email">
          <UInput v-model="email" type="email" placeholder="email@example.com" class="w-full" />
        </UFormField>
        
        <UFormField label="Password">
          <UInput v-model="password" type="password" class="w-full" />
        </UFormField>
        
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        
        <UButton type="submit" :loading="loading" class="w-full">
          Sign Up
        </UButton>
      </form>
      
      <template #footer>
        <p class="text-center text-sm">
          Already have an account? 
          <NuxtLink to="/login" class="text-primary hover:underline">Login</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>