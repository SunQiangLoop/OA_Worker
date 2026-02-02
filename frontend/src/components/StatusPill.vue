<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: 'pending' },
})

const label = computed(() => {
  switch (props.status) {
    case 'pending':
      return '待审批'
    case 'reviewing':
      return '审批中'
    case 'approved':
      return '已通过'
    case 'rejected':
      return '已拒绝'
    case 'open':
      return '待处理'
    case 'in_progress':
      return '处理中'
    case 'resolved':
      return '已解决'
    case 'closed':
      return '已关闭'
    default:
      return props.status
  }
})
</script>

<template>
  <span class="pill" :class="`pill--${props.status}`">{{ label }}</span>
</template>
