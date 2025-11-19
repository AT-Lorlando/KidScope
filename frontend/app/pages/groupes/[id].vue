<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const groupesStore = useGroupesStore()
const elevesStore = useElevesStore()

const groupeId = computed(() => Number(route.params.id))
const groupe = ref<any>(null)
const allEleves = ref<any[]>([])
const loading = ref(false)
const showAddForm = ref(false)
const searchTerm = ref('')

onMounted(async () => {
  loading.value = true
  try {
    groupe.value = await groupesStore.fetchById(groupeId.value)
    allEleves.value = await elevesStore.fetchAll()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loading.value = false
  }
})

const elevesInGroupe = computed(() => {
  return groupe.value?.eleves || []
})

const elevesNotInGroupe = computed(() => {
  const elevesIds = new Set(elevesInGroupe.value.map((e: any) => e.id))
  let filtered = allEleves.value.filter((e: any) => !elevesIds.has(e.id))

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(
      (eleve: any) =>
        eleve.nom.toLowerCase().includes(term) ||
        eleve.prenom.toLowerCase().includes(term)
    )
  }

  return filtered
})

const handleAddEleve = async (eleveId: number) => {
  try {
    await groupesStore.ajouterEleve(groupeId.value, eleveId)
    groupe.value = await groupesStore.fetchById(groupeId.value)
    searchTerm.value = ''
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'élève:', error)
  }
}

const handleRemoveEleve = async (eleveId: number) => {
  try {
    await groupesStore.retirerEleve(groupeId.value, eleveId)
    groupe.value = await groupesStore.fetchById(groupeId.value)
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élève:', error)
  }
}

const goToEleve = (id: number) => {
  router.push(`/eleves/${id}`)
}
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <Button variant="ghost" class="mb-4" @click="router.push('/groupes')">
      ← Retour aux groupes
    </Button>

    <div v-if="loading" class="text-center py-8">Chargement...</div>

    <div v-else-if="groupe">
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>{{ groupe.nom }}</CardTitle>
          <CardDescription>
            {{ elevesInGroupe.length }} élève(s) dans ce groupe
          </CardDescription>
        </CardHeader>
      </Card>

      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Élèves du groupe</h2>
          <Button @click="showAddForm = !showAddForm">
            {{ showAddForm ? 'Annuler' : 'Ajouter un élève' }}
          </Button>
        </div>

        <Card v-if="showAddForm" class="mb-4">
          <CardHeader>
            <CardTitle>Ajouter un élève</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="mb-4">
              <Input
                v-model="searchTerm"
                placeholder="Rechercher un élève..."
                class="w-full"
              />
            </div>
            <div v-if="elevesNotInGroupe.length === 0" class="text-sm text-muted-foreground">
              Aucun élève disponible
            </div>
            <div v-else class="space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="eleve in elevesNotInGroupe"
                :key="eleve.id"
                class="flex justify-between items-center p-2 border rounded"
              >
                <div>
                  <p class="font-medium">{{ eleve.prenom }} {{ eleve.nom }}</p>
                  <p class="text-sm text-muted-foreground">{{ eleve.niveau }}</p>
                </div>
                <Button size="sm" @click="handleAddEleve(eleve.id)">
                  Ajouter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div v-if="elevesInGroupe.length === 0" class="text-center py-8 text-muted-foreground">
          Aucun élève dans ce groupe
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            v-for="eleve in elevesInGroupe"
            :key="eleve.id"
          >
            <CardHeader>
              <div class="flex justify-between items-start">
                <div>
                  <CardTitle class="cursor-pointer hover:underline" @click="goToEleve(eleve.id)">
                    {{ eleve.prenom }} {{ eleve.nom }}
                  </CardTitle>
                  <CardDescription>
                    <Badge>{{ eleve.niveau }}</Badge>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="handleRemoveEleve(eleve.id)"
                >
                  Retirer
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

