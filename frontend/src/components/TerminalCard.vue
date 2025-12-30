<template>
  <div
    :class="[
      'card',
      { 'hover-effect': hover }
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hover?: boolean
}>()
</script>

<style scoped>
.card {
  background: linear-gradient(180deg, var(--sne-surface-1), rgba(27, 27, 31, 0.96));
  color: var(--sne-text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--elevation-card);
  padding: var(--spacing-4);
  transition: all 120ms ease;
}

.card.hover-effect:hover {
  border-color: var(--sne-accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
</style>
