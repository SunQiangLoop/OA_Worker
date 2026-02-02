<script setup>
import { computed } from 'vue'
const props = defineProps({
  current: { type: String, default: 'pending' },
})

const steps = [
  { key: 'pending', label: '待审批' },
  { key: 'reviewing', label: '审批中' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已拒绝' },
]

const currentIndex = computed(() => steps.findIndex((s) => s.key === props.current))
</script>

<template>
  <div class="flow">
    <div
      v-for="(step, idx) in steps"
      :key="step.key"
      class="flow-step"
      :class="{
        done: idx < currentIndex,
        active: idx === currentIndex,
      }"
    >
      <div class="flow-dot"></div>
      <div class="flow-label">{{ step.label }}</div>
      <div v-if="idx < steps.length - 1" class="flow-line"></div>
    </div>
  </div>
</template>
