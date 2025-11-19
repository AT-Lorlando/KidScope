<script setup lang="ts">
const { user, fetchProfile, logout } = useAuth()
const router = useRouter()

const loading = ref(true)

onMounted(async () => {
  if (!user.value) {
    try {
      await fetchProfile()
    } catch (err) {
      router.push('/login')
      return
    }
  }
  loading.value = false
})

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <Card class="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="text-center py-8">Loading...</div>
        <div v-else-if="user" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-muted-foreground">Full Name</label>
            <p class="text-lg">{{ user.firstName || '' }} {{ user.lastName || 'Not set' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-muted-foreground">Email</label>
            <p class="text-lg">{{ user.email }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-muted-foreground">User ID</label>
            <p class="text-lg">{{ user.id }}</p>
          </div>
          <div class="pt-4">
            <Button variant="destructive" @click="handleLogout">Logout</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

