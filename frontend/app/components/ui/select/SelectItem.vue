<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  value: string | null
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <option :value="props.value" :class="cn('relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground', props.class)">
    <slot />
  </option>
</template>




