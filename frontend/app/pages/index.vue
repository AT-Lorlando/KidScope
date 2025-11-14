<script setup lang="ts">
const { user } = useAuth()
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl font-bold mb-4">Welcome to WebTemplate</h1>
      <p class="text-xl text-muted-foreground mb-8">
        A fullstack template with Nuxt 3 and AdonisJS 6
      </p>
      <div v-if="user" class="space-y-4">
        <p class="text-lg">Hello, {{ user.fullName || user.email }}!</p>
        <div class="flex gap-4 justify-center">
          <NuxtLink to="/profile">
            <Button>View Profile</Button>
          </NuxtLink>
        </div>
      </div>
      <div v-else class="space-y-4">
        <p class="text-lg">Get started by creating an account or logging in.</p>
        <div class="flex gap-4 justify-center">
          <NuxtLink to="/login">
            <Button variant="outline">Login</Button>
          </NuxtLink>
          <NuxtLink to="/signup">
            <Button>Sign Up</Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>