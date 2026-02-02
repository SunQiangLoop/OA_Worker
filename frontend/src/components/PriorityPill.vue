<script setup>
import { computed } from 'vue'

const props = defineProps({
  priority: { type: String, default: 'medium' },
})

const label = computed(() => {
  switch (props.priority) {
    case 'low':
      return '低'
    case 'medium':
      return '中'
    case 'high':
      return '高'
    case 'urgent':
      return '紧急'
    default:
      return props.priority
  }
})
</script>

<template>
  <span class="pill pill--priority" :class="`pill--${props.priority}`">{{ label }}</span>
</template>
