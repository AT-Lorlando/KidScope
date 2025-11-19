<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const elevesStore = useElevesStore()
const router = useRouter()

const eleves = ref([])
const loading = ref(false)
const searchTerm = ref('')
const niveauFilter = ref<string | null>(null)

const niveaux = [
  'maternelle',
  'CP',
  'CE1',
  'CE2',
  'CM1',
  'CM2',
  '6e',
  '5e',
  '4e',
  '3e',
  '2nde',
  '1ère',
  'Terminale',
]

onMounted(async () => {
  loading.value = true
  try {
    await elevesStore.fetchAll()
    eleves.value = elevesStore.eleves
  } catch (error) {
    console.error('Erreur lors du chargement des élèves:', error)
  } finally {
    loading.value = false
  }
})

const filteredEleves = computed(() => {
  let filtered = eleves.value

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(
      (eleve: any) =>
        eleve.nom.toLowerCase().includes(term) ||
        eleve.prenom.toLowerCase().includes(term)
    )
  }

  if (niveauFilter.value) {
    filtered = filtered.filter((eleve: any) => eleve.niveau === niveauFilter.value)
  }

  return filtered
})

const goToEleve = (id: number) => {
  router.push(`/eleves/${id}`)
}
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Liste des élèves</h1>
      <Button @click="router.push('/groupes')">Voir les groupes</Button>
    </div>

    <Card class="mb-6">
      <CardContent class="pt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium mb-2 block">Rechercher</label>
            <Input
              v-model="searchTerm"
              placeholder="Nom ou prénom..."
              class="w-full"
            />
          </div>
          <div>
            <label class="text-sm font-medium mb-2 block">Filtrer par niveau</label>
            <Select v-model="niveauFilter" class="w-full">
              <option :value="null">Tous les niveaux</option>
              <option v-for="niveau in niveaux" :key="niveau" :value="niveau">
                {{ niveau }}
              </option>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <div v-if="loading" class="text-center py-8">Chargement...</div>

    <div v-else-if="filteredEleves.length === 0" class="text-center py-8 text-muted-foreground">
      Aucun élève trouvé
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        v-for="eleve in filteredEleves"
        :key="eleve.id"
        class="cursor-pointer hover:shadow-lg transition-shadow"
        @click="goToEleve(eleve.id)"
      >
        <CardHeader>
          <CardTitle>{{ eleve.prenom }} {{ eleve.nom }}</CardTitle>
          <CardDescription>
            <Badge>{{ eleve.niveau }}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Né(e) le {{ new Date(eleve.dateNaissance).toLocaleDateString('fr-FR') }}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

