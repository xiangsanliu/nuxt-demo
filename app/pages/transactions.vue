<script setup lang="ts">
const { transactions, refreshTransactions, deleteTransaction } = useAssets()
const { t } = useI18n()

useHead({
  title: t('transactions.title')
})

const isEditModalOpen = ref(false)
const selectedTransaction = ref<any>(null)

const columns = [
  { accessorKey: 'date', header: t('transactions.date') },
  { accessorKey: 'symbol', header: t('transactions.symbol') },
  { accessorKey: 'type', header: t('transactions.type') },
  { accessorKey: 'amount', header: t('transactions.amount') },
  { accessorKey: 'price', header: t('transactions.price') },
  { accessorKey: 'currency', header: t('transactions.currency') },
  { accessorKey: 'actions', header: t('assets.table.actions') }
]

onMounted(() => {
  refreshTransactions()
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

const formatNumber = (num: number, decimals = 2) => {
  return num?.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) || '0.00'
}

const getTypeLabel = (type: string) => {
  const tStr = type.toUpperCase()
  if (tStr === 'BUY') return { label: t('transactions.types.buy'), color: 'primary' }
  if (tStr === 'SELL') return { label: t('transactions.types.sell'), color: 'error' }
  if (tStr === 'REGISTER') return { label: t('transactions.types.register'), color: 'neutral' }
  return { label: tStr, color: 'neutral' }
}

const editTransaction = (tr: any) => {
  selectedTransaction.value = tr
  isEditModalOpen.value = true
}

const confirmDelete = async (id: number) => {
  if (confirm(t('transactions.confirmDelete'))) {
    await deleteTransaction(id)
  }
}
</script>

<template>
  <UContainer class="py-10">
    <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">{{ t('transactions.title') }}</h1>
        <p class="text-gray-500 mt-1 text-sm">{{ t('transactions.subtitle') }}</p>
      </div>

    </div>

    <UCard :ui="{ body: 'p-0 sm:p-6' }">
      <div class="overflow-x-auto">
        <UTable :data="transactions" :columns="columns">
          <template #date-cell="{ row }">
            <span class="whitespace-nowrap text-xs md:text-sm">{{ formatDate(row.original.date) }}</span>
          </template>

          <template #symbol-cell="{ row }">
            <span class="font-bold text-xs md:text-sm">{{ row.original.symbol }}</span>
          </template>

          <template #type-cell="{ row }">
            <UBadge :color="getTypeLabel(row.original.type).color" variant="soft" size="xs">
              {{ getTypeLabel(row.original.type).label }}
            </UBadge>
          </template>

          <template #amount-cell="{ row }">
            <span class="text-xs md:text-sm">{{ formatNumber(row.original.amount, 2) }}</span>
          </template>

          <template #price-cell="{ row }">
            <span class="text-xs md:text-sm">{{ formatNumber(row.original.price) }}</span>
          </template>

          <template #currency-cell="{ row }">
            <span class="text-xs text-gray-400">{{ row.original.currency }}</span>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex gap-1">
              <UButton 
                icon="i-heroicons-pencil-square" 
                size="xs" 
                color="neutral" 
                variant="ghost" 
                @click="editTransaction(row.original)"
              />
              <UButton 
                icon="i-heroicons-trash" 
                size="xs" 
                color="error" 
                variant="ghost" 
                @click="confirmDelete(row.original.id)"
              />
            </div>
          </template>
        </UTable>
      </div>

      <div v-if="transactions.length === 0" class="text-center py-10 text-gray-500">
        暂无操作记录。
      </div>
    </UCard>

    <UModal v-model:open="isEditModalOpen" title="编辑操作记录">
      <template #content>
        <div class="p-4">
          <AssetForm 
            v-if="selectedTransaction" 
            :transaction="selectedTransaction" 
            @success="isEditModalOpen = false" 
          />
        </div>
      </template>
    </UModal>
  </UContainer>
</template>
