<script setup lang="ts">
import type { AssetInfo } from '~~/types/asset-info'

const counter = ref(0)
const symbol = ref('AAPL')

const handleClick = () => {
  counter.value++
}

const handleRefresh = () => {
  refresh()
}

// 获取 Hello World 数据
const { data: helloData } = await useFetch<{ message: string }>('/api/hello')

// 获取股价数据，使用 watch: [symbol] 响应搜索
const { data: stock, pending, error, refresh } = await useFetch<AssetInfo>('/api/stock', {
  query: { symbol },
  watch: false
})

</script>

<template>
  <UApp>
    <h1>{{ helloData?.message }}</h1>

    <div style="border: 1px solid #ccc; padding: 20px; margin: 20px 0;">
      <h2>Stock Price Tracker</h2>
      <UInput v-model="symbol" placeholder="Enter symbol (e.g. TSLA)" />
      <UButton @click="handleRefresh" :disabled="pending">Refresh</UButton>

      <div v-if="pending">Loading...</div>
      <div v-else-if="error" style="color: red;">Error: {{ error.statusMessage }}</div>
      <div v-else-if="stock">
        <p><strong>Name:</strong> {{ stock.name }} ({{ stock.symbol }})</p>
        <p><strong>Price:</strong> {{ stock.price }} {{ stock.currency }}</p>
      </div>
    </div>
  </UApp>
</template>
