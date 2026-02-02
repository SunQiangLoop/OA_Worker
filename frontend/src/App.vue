<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from './components/AppShell.vue'

const route = useRoute()
const useAuthLayout = computed(() => route.meta.layout === 'auth')
</script>

<template>
  <component :is="useAuthLayout ? 'div' : AppShell">
    <RouterView />
  </component>
</template>
