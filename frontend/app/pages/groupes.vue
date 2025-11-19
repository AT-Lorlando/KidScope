<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const groupesStore = useGroupesStore()
const router = useRouter()

const groupes = ref<any[]>([])
const loading = ref(false)
const showCreateForm = ref(false)
const newGroupe = ref({ nom: '' })

onMounted(async () => {
  loading.value = true
  try {
    await groupesStore.fetchAll()
    groupes.value = groupesStore.groupes
  } catch (error) {
    console.error('Erreur lors du chargement des groupes:', error)
  } finally {
    loading.value = false
  }
})

const handleCreateGroupe = async () => {
  try {
    await groupesStore.create(newGroupe.value)
    groupes.value = groupesStore.groupes
    newGroupe.value = { nom: '' }
    showCreateForm.value = false
  } catch (error) {
    console.error('Erreur lors de la création du groupe:', error)
  }
}

const goToGroupe = (id: number) => {
  router.push(`/groupes/${id}`)
}
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Mes groupes</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="router.push('/eleves')">Voir les élèves</Button>
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
        <form @submit.prevent="handleCreateGroupe" class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">Nom du groupe</label>
            <Input v-model="newGroupe.nom" placeholder="Ex: Groupe de suivi" required />
          </div>
          <Button type="submit">Créer</Button>
        </form>
      </CardContent>
    </Card>

    <div v-if="loading" class="text-center py-8">Chargement...</div>

    <div v-else-if="groupes.length === 0" class="text-center py-8 text-muted-foreground">
      Aucun groupe créé. Créez votre premier groupe pour commencer.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        v-for="groupe in groupes"
        :key="groupe.id"
        class="cursor-pointer hover:shadow-lg transition-shadow"
        @click="goToGroupe(groupe.id)"
      >
        <CardHeader>
          <CardTitle>{{ groupe.nom }}</CardTitle>
          <CardDescription>
            {{ groupe.eleves?.length || 0 }} élève(s)
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>

