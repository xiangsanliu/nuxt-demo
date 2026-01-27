<script setup lang="ts">
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const toast = useToast()

const onSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.add({ title: '两次输入的密码不一致', color: 'error' })
    return
  }

  if (newPassword.value.length < 6) {
    toast.add({ title: '新密码长度至少为 6 位', color: 'error' })
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
    toast.add({ title: '密码修改成功', color: 'success' })
    // 清空表单
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err: any) {
    toast.add({ 
      title: '修改失败', 
      description: err.data?.statusMessage || '请检查旧密码是否正确', 
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
      <h1 class="text-3xl font-bold">账号设置</h1>
      <p class="text-gray-500 mt-2">修改您的登录密码</p>
    </div>

    <UCard>
      <UForm :state="{}" @submit="onSubmit" class="space-y-4">
        <UFormField label="当前密码" name="oldPassword">
          <UInput v-model="oldPassword" type="password" placeholder="请输入当前密码" block />
        </UFormField>

        <UFormField label="新密码" name="newPassword">
          <UInput v-model="newPassword" type="password" placeholder="至少 6 位字符" block />
        </UFormField>

        <UFormField label="确认新密码" name="confirmPassword">
          <UInput v-model="confirmPassword" type="password" placeholder="请再次输入新密码" block />
        </UFormField>

        <div class="pt-4">
          <UButton type="submit" block color="primary" :loading="loading">
            修改密码
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
