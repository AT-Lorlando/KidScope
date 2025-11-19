<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  placeholder?: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <span :class="cn('text-muted-foreground', props.class)">
    <slot>{{ placeholder }}</slot>
  </span>
</template>




