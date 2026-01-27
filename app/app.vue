<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <UApp>
    <nav v-if="user" class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
      <NuxtLink to="/" class="font-bold">Nuxt D1 Auth</NuxtLink>
      <div class="flex items-center gap-4">
        <span>{{ user.email }}</span>
        <UButton variant="ghost" color="neutral" @click="logout">Logout</UButton>
      </div>
    </nav>
    <main class="p-4">
      <NuxtPage />
    </main>
  </UApp>
</template>
