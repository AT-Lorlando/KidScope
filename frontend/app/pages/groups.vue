<script setup lang="ts">
import type { Group } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const groupsStore = useGroupsStore()
const router = useRouter()

const groups = ref<Group[]>([])
const loading = ref(false)
const showCreateForm = ref(false)
const newGroup = ref({ name: '' })

onMounted(async () => {
  loading.value = true
  try {
    await groupsStore.fetchAll()
    groups.value = groupsStore.groups
  } catch (error) {
    console.error('Error loading groups:', error)
  } finally {
    loading.value = false
  }
})

const handleCreateGroup = async () => {
  try {
    await groupsStore.create(newGroup.value)
    groups.value = groupsStore.groups
    newGroup.value = { name: '' }
    showCreateForm.value = false
  } catch (error) {
    console.error('Error creating group:', error)
  }
}

const goToGroup = (id: number) => {
  router.push(`/groups/${id}`)
}
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Mes groupes</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="router.push('/students')">Voir les élèves</Button>
        <Button @click="showCreateForm = !showCreateForm">
          {{ showCreateForm ? 'Annuler' : 'Créer un groupe' }}
        </Button>
      </div>
    </div>

    <Card v-if="showCreateForm" class="mb-6">
      <CardHeader>
        <CardTitle>Nouveau groupe</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleCreateGroup" class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">Nom du groupe</label>
            <Input v-model="newGroup.name" placeholder="Ex: Groupe de suivi" required />
          </div>
          <Button type="submit">Créer</Button>
        </form>
      </CardContent>
    </Card>

    <div v-if="loading" class="text-center py-8">Chargement...</div>

    <div v-else-if="groups.length === 0" class="text-center py-8 text-muted-foreground">
      Aucun groupe créé. Créez votre premier groupe pour commencer.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        v-for="group in groups"
        :key="group.id"
        class="cursor-pointer hover:shadow-lg transition-shadow"
        @click="goToGroup(group.id)"
      >
        <CardHeader>
          <CardTitle>{{ group.name }}</CardTitle>
          <CardDescription>
            {{ group.students?.length || 0 }} élève(s)
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>

