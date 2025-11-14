<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'

interface Props extends PrimitiveProps {
  type?: string
  placeholder?: string
  class?: HTMLAttributes['class']
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'input',
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = computed({
  get: () => props.modelValue || '',
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :type="type"
    :placeholder="placeholder"
    :value="value"
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
    @input="value = ($event.target as HTMLInputElement).value"
  />
</template>

