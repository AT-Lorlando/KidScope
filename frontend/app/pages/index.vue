<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    router.push('/eleves')
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-4xl mx-auto text-center">
      <p class="text-xl text-muted-foreground">Redirection...</p>
    </div>
  </div>
</template>