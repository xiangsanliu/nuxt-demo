<script setup lang="ts">
const { locale, setLocale, t } = useI18n()

useHead({
  title: t('settings.title')
})

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const toast = useToast()

const languages = [
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: 'English', value: 'en' }
]

const onSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.add({ title: t('settings.mismatch'), color: 'error' })
    return
  }

  if (newPassword.value.length < 6) {
    toast.add({ title: t('settings.tooShort'), color: 'error' })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      }
    })
    toast.add({ title: t('settings.success'), color: 'success' })
    // 清空表单
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err: any) {
    toast.add({ 
      title: t('settings.submit'), 
      description: err.data?.statusMessage || 'Error', 
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-10 max-w-md">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">{{ t('settings.title') }}</h1>
      <p class="text-gray-500 mt-2">{{ t('settings.subtitle') }}</p>
    </div>

    <UCard class="mb-6">
      <template #header>
        <h3 class="font-bold">{{ t('settings.language') }}</h3>
      </template>
      <USelect 
        :model-value="locale" 
        @update:model-value="(val) => setLocale(val as any)" 
        :items="languages" 
        block 
      />
    </UCard>

    <UCard>
      <template #header>
        <h3 class="font-bold">{{ t('settings.submit') }}</h3>
      </template>
      <UForm :state="{}" @submit="onSubmit" class="space-y-4">
        <UFormField :label="t('settings.oldPassword')" name="oldPassword">
          <UInput v-model="oldPassword" type="password" block />
        </UFormField>

        <UFormField :label="t('settings.newPassword')" name="newPassword">
          <UInput v-model="newPassword" type="password" block />
        </UFormField>

        <UFormField :label="t('settings.confirmPassword')" name="confirmPassword">
          <UInput v-model="confirmPassword" type="password" block />
        </UFormField>

        <div class="pt-4">
          <UButton type="submit" block color="primary" :loading="loading">
            {{ t('settings.submit') }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
