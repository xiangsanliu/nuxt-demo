<script setup lang="ts">
const { holdings, refreshPrices, displayCurrency, isPriceLoading } = useAssets()
const { t } = useI18n()

const columns = [
  { accessorKey: 'symbol', header: t('assets.table.symbol') },
  { accessorKey: 'name', header: t('assets.table.name'), class: 'hidden sm:table-cell' },
  { accessorKey: 'quantity', header: t('assets.table.quantity') },
  { accessorKey: 'currentPrice', header: t('assets.table.price'), class: 'hidden md:table-cell' },
  { accessorKey: 'displayValue', header: t('assets.table.value') },
  { accessorKey: 'displayProfit', header: t('assets.table.profit') }
]

const formatNumber = (num: number, decimals = 2) => {
  return num?.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) || '0.00'
}

onMounted(() => {
  refreshPrices()
})
</script>

<template>
  <div class="space-y-4 pt-4 sm:pt-0">
    <div class="flex justify-between items-center px-4 sm:px-0">
      <h3 class="text-lg font-bold">{{ t('assets.table.name') }} ({{ displayCurrency }})</h3>
      <UButton 
        icon="i-heroicons-arrow-path" 
        color="neutral" 
        variant="ghost" 
        :loading="isPriceLoading"
        @click="refreshPrices(true)"
      > 
        {{ t('assets.refresh') }} 
      </UButton>
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
        {{ formatNumber(row.original.averageCost) }} <span class="text-xs text-gray-400">{{ row.original.currency }}</span>
      </template>

      <template #currentPrice-cell="{ row }">
        {{ formatNumber(row.original.currentPrice) }} <span class="text-xs text-gray-400">{{ row.original.currency }}</span>
      </template>

      <template #displayValue-cell="{ row }">
        <div class="font-bold">
          {{ formatNumber(row.original.displayValue) }}
          <span class="text-xs font-normal text-gray-400 ml-1">{{ displayCurrency }}</span>
        </div>
      </template>

      <template #displayProfit-cell="{ row }">
        <span :class="row.original.profitUSD >= 0 ? 'text-green-500' : 'text-red-500'">
          {{ row.original.profitUSD >= 0 ? '+' : '' }}{{ formatNumber(row.original.displayProfit) }}
          ({{ formatNumber(row.original.profitPercent) }}%)
        </span>
      </template>
    </UTable>

    <div v-if="holdings.length === 0" class="text-center py-10 text-gray-500">
      {{ t('assets.table.empty') }}
    </div>
  </div>
</template>
