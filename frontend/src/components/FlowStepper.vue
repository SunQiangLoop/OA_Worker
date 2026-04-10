<script setup>
import { computed } from 'vue'
const props = defineProps({
  current: { type: String, default: 'pending' },
  currentStep: { type: String, default: 'dept_approve' },
})

const steps = [
  { key: 'start', label: '发起' },
  { key: 'dept_approve', label: '部门经理审批' },
  { key: 'finance_approve', label: '财务审核' },
  { key: 'gm_approve', label: '总经理审批' },
  { key: 'completed', label: '完成' },
]

const stepOrder = { start: 0, dept_approve: 1, finance_approve: 2, gm_approve: 3, completed: 4 }

const currentIndex = computed(() => {
  if (props.current === 'rejected') {
    return stepOrder[props.currentStep] ?? 1
  }
  if (props.current === 'approved') return 4
  return stepOrder[props.currentStep] ?? 1
})
</script>

<template>
  <div class="flow">
    <div
      v-for="(step, idx) in steps"
      :key="step.key"
      class="flow-step"
      :class="{
        done: idx < currentIndex,
        active: idx === currentIndex && current !== 'rejected',
        error: idx === currentIndex && current === 'rejected',
      }"
    >
      <div class="flow-dot"></div>
      <div class="flow-label">{{ step.label }}</div>
      <div v-if="idx < steps.length - 1" class="flow-line"></div>
    </div>
  </div>
</template>
