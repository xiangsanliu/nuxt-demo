<script setup lang="ts">
const { transactions, refreshTransactions, deleteTransaction } = useAssets()

const isEditModalOpen = ref(false)
const selectedTransaction = ref<any>(null)

const columns = [
  { accessorKey: 'date', header: '日期' },
  { accessorKey: 'symbol', header: '代码' },
  { accessorKey: 'type', header: '类型' },
  { accessorKey: 'amount', header: '数量' },
  { accessorKey: 'price', header: '价格' },
  { accessorKey: 'currency', header: '货币' },
  { accessorKey: 'actions', header: '操作' }
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
  const t = type.toUpperCase()
  if (t === 'BUY') return { label: '买入', color: 'primary' }
  if (t === 'SELL') return { label: '卖出', color: 'error' }
  return { label: t, color: 'neutral' }
}

const editTransaction = (tr: any) => {
  selectedTransaction.value = tr
  isEditModalOpen.value = true
}

const confirmDelete = async (id: number) => {
  if (confirm('确定要删除这条记录吗？')) {
    await deleteTransaction(id)
  }
}
</script>

<template>
  <UContainer class="py-10">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">操作记录</h1>
        <p class="text-gray-500 mt-2">管理您的所有买入和卖出记录</p>
      </div>
      <UButton to="/" icon="i-heroicons-arrow-left" variant="ghost">返回资产概览</UButton>
    </div>

    <UCard>
      <UTable :data="transactions" :columns="columns">
        <template #date-cell="{ row }">
          {{ formatDate(row.original.date) }}
        </template>

        <template #symbol-cell="{ row }">
          <span class="font-bold">{{ row.original.symbol }}</span>
        </template>

        <template #type-cell="{ row }">
          <UBadge :color="getTypeLabel(row.original.type).color" variant="soft">
            {{ getTypeLabel(row.original.type).label }}
          </UBadge>
        </template>

        <template #amount-cell="{ row }">
          {{ formatNumber(row.original.amount, 4) }}
        </template>

        <template #price-cell="{ row }">
          {{ formatNumber(row.original.price) }}
        </template>

        <template #actions-cell="{ row }">
          <div class="flex gap-2">
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
