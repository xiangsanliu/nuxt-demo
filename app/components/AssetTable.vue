<script setup lang="ts">
const { holdings, refreshPrices } = useAssets()

const columns = [
  { accessorKey: 'name', header: '名称' },
  { accessorKey: 'symbol', header: '代码' },
  { accessorKey: 'quantity', header: '持有数量' },
  { accessorKey: 'averageCost', header: '平均成本' },
  { accessorKey: 'currentPrice', header: '当前价格' },
  { accessorKey: 'value', header: '市值' },
  { accessorKey: 'profit', header: '盈亏' },
  { accessorKey: 'currency', header: '币种' }
]

const formatNumber = (num: number, decimals = 2) => {
  return num?.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) || '0.00'
}

onMounted(() => {
  refreshPrices()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-bold">资产概览</h3>
      <UButton icon="i-heroicons-arrow-path" color="neutral" variant="ghost" @click="refreshPrices"> 刷新价格 </UButton>
    </div>

    <UTable :data="holdings" :columns="columns">
      <template #name-cell="{ row }">
        <div class="font-medium text-gray-900 dark:text-white">
          {{ row.original.name }}
        </div>
      </template>

      <template #quantity-cell="{ row }">
        {{ formatNumber(row.original.quantity, 4) }}
      </template>

      <template #averageCost-cell="{ row }">
        {{ formatNumber(row.original.averageCost) }}
      </template>

      <template #currentPrice-cell="{ row }">
        {{ formatNumber(row.original.currentPrice) }}
      </template>

      <template #value-cell="{ row }">
        {{ formatNumber(row.original.value) }}
      </template>

      <template #profit-cell="{ row }">
        <span :class="row.original.profit >= 0 ? 'text-green-500' : 'text-red-500'">
          {{ row.original.profit >= 0 ? '+' : '' }}{{ formatNumber(row.original.profit) }}
          ({{ formatNumber(row.original.profitPercent) }}%)
        </span>
      </template>
    </UTable>

    <div v-if="holdings.length === 0" class="text-center py-10 text-gray-500">
      暂无资产，请点击“新增操作”添加。
    </div>
  </div>
</template>
