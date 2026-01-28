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
  <UContainer class="py-6 md:py-10">
    <div class="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
      <div class="w-full md:w-auto">
        <div class="flex flex-wrap items-center gap-4 mb-3">
          <h1 class="text-2xl md:text-3xl font-bold">我的资产</h1>
          <USelect v-model="displayCurrency" :items="currencyOptions" class="w-full md:w-40" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:flex md:gap-6 text-sm">
          <UCard variant="soft" class="p-3 md:p-0 md:bg-transparent md:border-none md:shadow-none">
            <span class="text-gray-500 block md:inline text-xs">总市值</span>
            <span class="text-lg md:text-sm font-bold md:ml-1">≈ {{ totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }) }} {{ displayCurrency }}</span>
          </UCard>
          <UCard variant="soft" class="p-3 md:p-0 md:bg-transparent md:border-none md:shadow-none">
            <span class="text-gray-500 block md:inline text-xs">总盈亏</span>
            <span :class="['text-lg md:text-sm font-bold md:ml-1', totalProfit >= 0 ? 'text-green-500' : 'text-red-500']">
              {{ totalProfit >= 0 ? '+' : '' }}{{ totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
              ({{ totalProfitPercent.toFixed(2) }}%)
            </span>
          </UCard>
        </div>
      </div>
      
      <UButton icon="i-heroicons-plus" @click="isModalOpen = true" block class="md:w-auto">
        新增操作
      </UButton>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-6' }">
      <div class="overflow-x-auto">
        <AssetTable />
      </div>
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
