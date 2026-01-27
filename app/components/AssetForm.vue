<script setup lang="ts">
import type { TransactionType } from '~/types/asset-info'

const emit = defineEmits(['success'])
const { addTransaction } = useAssets()

const form = reactive({
  symbol: '',
  type: 'buy' as TransactionType,
  quantity: 1,
  price: 0,
  date: new Date().toISOString().split('T')[0],
  currency: 'USD'
})

const loading = ref(false)

const types = [
  { label: '登记资产', value: 'register' },
  { label: '买入', value: 'buy' },
  { label: '卖出', value: 'sell' }
]

const currencies = ['USD', 'HKD', 'CNY']

const fetchSymbolInfo = async () => {
  if (!form.symbol) return
  loading.value = true
  try {
    const data = await $fetch<any>('/api/stock', { query: { symbol: form.symbol } })
    if (data) {
      form.price = data.price
      form.currency = data.currency
    }
  } catch (e) {
    console.error('Failed to fetch symbol info', e)
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  loading.value = true
  try {
    await addTransaction({
      symbol: form.symbol.toUpperCase(),
      type: form.type,
      amount: form.quantity, // 明确传递 amount 字段
      price: form.price,
      date: form.date,
      currency: form.currency
    })
    emit('success')
    // Reset form
    form.symbol = ''
    form.quantity = 1
    form.price = 0
  } catch (err) {
    console.error('Failed to add transaction', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UForm :state="form" @submit="onSubmit" class="space-y-4">
    <UFormField label="股票代码 (Symbol)" name="symbol">
      <div class="flex gap-2 w-full">
        <UInput v-model="form.symbol" placeholder="如 AAPL, 0700.HK, 600519.SS" class="flex-1" />
        <UButton :loading="loading" @click="fetchSymbolInfo" color="neutral" variant="soft">获取现价</UButton>
      </div>
    </UFormField>

    <UFormField label="操作类型" name="type">
      <USelect v-model="form.type" :items="types" class="w-full" />
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="数量" name="quantity">
        <UInput v-model="form.quantity" type="number" step="0.0001" class="w-full" />
      </UFormField>

      <UFormField label="价格" name="price">
        <UInput v-model="form.price" type="number" step="0.0001" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="日期" name="date">
        <UInput v-model="form.date" type="date" class="w-full" />
      </UFormField>

      <UFormField label="货币" name="currency">
        <USelect v-model="form.currency" :items="currencies" class="w-full" />
      </UFormField>
    </div>

    <UButton type="submit" block color="primary"> 确认 </UButton>
  </UForm>
</template>
