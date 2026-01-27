<script setup lang="ts">
const { holdings, refreshRates, refreshHoldings, displayCurrency, rates } = useAssets()
const isModalOpen = ref(false)

const currencyOptions = [
  { label: 'USD (美元)', value: 'USD' },
  { label: 'HKD (港币)', value: 'HKD' },
  { label: 'CNY (人民币)', value: 'CNY' }
]

onMounted(() => {
  refreshHoldings()
  refreshRates()
})

const totalValue = computed(() => {
  return holdings.value.reduce((acc, h) => acc + (h.displayValue || 0), 0)
})

const totalProfit = computed(() => {
  return holdings.value.reduce((acc, h) => acc + (h.displayProfit || 0), 0)
})

const totalProfitPercent = computed(() => {
  const totalCost = holdings.value.reduce((acc, h) => acc + (h.displayTotalCost || 0), 0)
  return totalCost > 0 ? (totalProfit.value / totalCost) * 100 : 0
})
</script>

<template>
  <UContainer class="py-10">
    <div class="flex justify-between items-start mb-8">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <h1 class="text-3xl font-bold">我的资产</h1>
          <USelect v-model="displayCurrency" :items="currencyOptions" class="w-40" />
        </div>
        <div class="flex gap-4 text-sm">
          <div>
            <span class="text-gray-500">总市值:</span>
            <span class="ml-1 font-bold">≈ {{ totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }) }} {{ displayCurrency }}</span>
          </div>
          <div>
            <span class="text-gray-500">总盈亏:</span>
            <span :class="['ml-1 font-bold', totalProfit >= 0 ? 'text-green-500' : 'text-red-500']">
              {{ totalProfit >= 0 ? '+' : '' }}{{ totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
              ({{ totalProfitPercent.toFixed(2) }}%)
            </span>
          </div>
        </div>
      </div>
      
      <UButton icon="i-heroicons-plus" @click="isModalOpen = true">
        新增操作
      </UButton>
    </div>

    <UCard>
      <AssetTable />
    </UCard>

    <UModal v-model:open="isModalOpen" title="资产操作">
      <template #content>
        <div class="p-4">
          <AssetForm @success="isModalOpen = false" />
        </div>
      </template>
    </UModal>
  </UContainer>
</template>
