<script setup lang="ts">
const { holdings, refreshRates, refreshHoldings, displayCurrency, rates, isLoading } = useAssets()
const { t } = useI18n()

useHead({
  title: t('assets.title')
})

const isModalOpen = ref(false)

const currencyOptions = [
  { label: t('assets.usd'), value: 'USD' },
  { label: t('assets.hkd'), value: 'HKD' },
  { label: t('assets.cny'), value: 'CNY' }
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
          <h1 class="text-2xl md:text-3xl font-bold">{{ t('assets.title') }}</h1>
          <USelect v-model="displayCurrency" :items="currencyOptions" class="w-full md:w-40" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:flex md:gap-6 text-sm">
          <UCard variant="soft" class="p-3 md:p-0 md:bg-transparent md:border-none md:shadow-none">
            <span class="text-gray-500 block md:inline text-xs">{{ t('assets.totalValue') }}</span>
            <span class="text-lg md:text-sm font-bold md:ml-1">≈ {{ totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }) }} {{ displayCurrency }}</span>
          </UCard>
          <UCard variant="soft" class="p-3 md:p-0 md:bg-transparent md:border-none md:shadow-none">
            <span class="text-gray-500 block md:inline text-xs">{{ t('assets.totalProfit') }}</span>
            <span :class="['text-lg md:text-sm font-bold md:ml-1', totalProfit >= 0 ? 'text-green-500' : 'text-red-500']">
              {{ totalProfit >= 0 ? '+' : '' }}{{ totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
              ({{ totalProfitPercent.toFixed(2) }}%)
            </span>
          </UCard>
        </div>
      </div>
      
      <UButton icon="i-heroicons-plus" @click="isModalOpen = true" block class="md:w-auto">
        {{ t('assets.add') }}
      </UButton>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-6' }">
      <div v-if="isLoading && holdings.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
        <UIcon name="i-lucide-loader-2" class="text-4xl animate-spin text-primary" />
        <span class="text-sm text-gray-500 animate-pulse font-medium">正在获取最新资产数据...</span>
      </div>
      <div v-else class="overflow-x-auto">
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
