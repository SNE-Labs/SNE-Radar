<template>
  <button
    :class="[
      'btn',
      variant,
      size,
      { 'w-full': fullWidth, 'disabled': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 120ms ease;
  border: 1px solid transparent;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:active:not(:disabled) {
  transform: translateY(1px) scale(0.998);
}

/* Primary */
.btn.primary {
  background: var(--sne-accent);
  color: var(--sne-text-primary);
  border-color: rgba(255, 106, 0, 0.75);
  box-shadow: 0 6px 18px rgba(255, 106, 0, 0.12);
}

.btn.primary:hover:not(:disabled) {
  background: var(--sne-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(255, 106, 0, 0.2);
}

.btn.primary:active:not(:disabled) {
  background: var(--sne-accent-active);
  transform: translateY(0);
}

/* Secondary */
.btn.secondary {
  background: var(--sne-surface-1);
  color: var(--sne-text-primary);
  border-color: var(--border);
}

.btn.secondary:hover:not(:disabled) {
  background: var(--sne-surface-elevated);
  border-color: var(--sne-accent);
}

/* Danger */
.btn.danger {
  background: var(--sne-critical);
  color: var(--sne-text-primary);
  border-color: rgba(255, 77, 79, 0.75);
}

.btn.danger:hover:not(:disabled) {
  background: #E64446;
  transform: translateY(-1px);
}

/* Success */
.btn.success {
  background: var(--sne-success);
  color: var(--sne-text-primary);
  border-color: rgba(0, 196, 140, 0.75);
}

.btn.success:hover:not(:disabled) {
  background: #00B07A;
  transform: translateY(-1px);
}

/* Sizes */
.btn.sm {
  padding: calc(var(--spacing-1) / 2) var(--spacing-2);
  font-size: var(--text-small);
}

.btn.md {
  padding: calc(var(--spacing-1) / 2) var(--spacing-2);
  font-size: var(--text-body);
}

.btn.lg {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--text-body-lg);
}
</style>
