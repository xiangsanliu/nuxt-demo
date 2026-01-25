<script setup lang="ts">
const { holdings, refreshRates } = useAssets()
const isModalOpen = ref(false)

onMounted(() => {
  refreshRates()
})

const totalValue = computed(() => {
  return holdings.value.reduce((acc, h) => acc + (h.valueUSD || 0), 0)
})

const totalProfit = computed(() => {
  return holdings.value.reduce((acc, h) => acc + (h.profitUSD || 0), 0)
})

const totalProfitPercent = computed(() => {
  const totalCostUSD = holdings.value.reduce((acc, h) => acc + (h.totalCostUSD || 0), 0)
  return totalCostUSD > 0 ? (totalProfit.value / totalCostUSD) * 100 : 0
})
</script>

<template>
  <UContainer class="py-10">
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold mb-2">我的资产</h1>
        <div class="flex gap-4 text-sm">
          <div>
            <span class="text-gray-500">总市值:</span>
            <span class="ml-1 font-bold">≈ {{ totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }) }} USD</span>
          </div>
          <div>
            <span class="text-gray-500">当日盈亏:</span>
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
