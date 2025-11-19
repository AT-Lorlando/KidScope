<script setup lang="ts">
const { isAuthenticated, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<template>
  <nav class="border-b bg-background">
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <NuxtLink to="/" class="text-xl font-bold">WebTemplate</NuxtLink>
      <div class="flex items-center gap-4">
        <ClientOnly>
          <template v-if="isAuthenticated">
            <NuxtLink to="/profile" class="text-sm hover:underline">
              Profile
            </NuxtLink>
            <Button variant="outline" size="sm" @click="handleLogout">
              Logout
            </Button>
          </template>
          <template v-else>
            <NuxtLink to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </NuxtLink>
            <NuxtLink to="/signup">
              <Button size="sm">Sign Up</Button>
            </NuxtLink>
          </template>
        </ClientOnly>
      </div>
    </div>
  </nav>
</template>
