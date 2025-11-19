<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const lastName = ref('')
const firstName = ref('')
const error = ref('')
const loading = ref(false)

const handleSignup = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.signup(email.value, password.value, firstName.value, lastName.value)
    router.push('/students')
  } catch (err: any) {
    error.value = err.data?.message || 'Signup failed. Please try again.'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: false,
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSignup" class="space-y-4">
          <div v-if="error" class="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {{ error }}
          </div>
          <div class="space-y-2">
            <label for="firstName" class="text-sm font-medium">Prénom</label>
            <Input
              id="firstName"
              v-model="firstName"
              type="text"
              placeholder="Jean"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="lastName" class="text-sm font-medium">Nom</label>
            <Input
              id="lastName"
              v-model="lastName"
              type="text"
              placeholder="Dupont"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium">Email</label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium">Password</label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Creating account...' : 'Sign Up' }}
          </Button>
          <div class="text-center text-sm">
            Already have an account?
            <NuxtLink to="/login" class="text-primary hover:underline">Login</NuxtLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

