<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const elevesStore = useElevesStore()
const evenementsStore = useEvenementsStore()

const eleveId = computed(() => Number(route.params.id))
const eleve = ref<any>(null)
const evenements = ref<any[]>([])
const loading = ref(false)
const showAddEventForm = ref(false)

const newEvent = ref({
  type: 'suivi_pedagogique' as const,
  titre: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  compteRendu: '',
})

const eventTypes = [
  { value: 'discipline', label: 'Discipline' },
  { value: 'convocation', label: 'Convocation' },
  { value: 'orientation', label: 'Orientation' },
  { value: 'rencontre_parent', label: 'Rencontre parent' },
  { value: 'suivi_pedagogique', label: 'Suivi pédagogique' },
]

onMounted(async () => {
  loading.value = true
  try {
    eleve.value = await elevesStore.fetchById(eleveId.value)
    evenements.value = await evenementsStore.fetchByEleve(eleveId.value)
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loading.value = false
  }
})

const handleAddEvent = async () => {
  try {
    const date = newEvent.value.date
    if (!date) {
      throw new Error('La date est requise')
    }
    await evenementsStore.create(eleveId.value, {
      ...newEvent.value,
      date,
    })
    evenements.value = await evenementsStore.fetchByEleve(eleveId.value)
    showAddEventForm.value = false
    newEvent.value = {
      type: 'suivi_pedagogique',
      titre: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      compteRendu: '',
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'événement:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const getEventTypeLabel = (type: string) => {
  return eventTypes.find((t) => t.value === type)?.label || type
}
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <Button variant="ghost" class="mb-4" @click="router.push('/eleves')">
      ← Retour à la liste
    </Button>

    <div v-if="loading" class="text-center py-8">Chargement...</div>

    <div v-else-if="eleve">
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>{{ eleve.prenom }} {{ eleve.nom }}</CardTitle>
          <CardDescription>
            <Badge>{{ eleve.niveau }}</Badge>
            <span class="ml-2">
              Né(e) le {{ formatDate(eleve.dateNaissance) }}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>

      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Événements</h2>
          <Button @click="showAddEventForm = !showAddEventForm">
            {{ showAddEventForm ? 'Annuler' : 'Ajouter un événement' }}
          </Button>
        </div>

        <Card v-if="showAddEventForm" class="mb-4">
          <CardHeader>
            <CardTitle>Nouvel événement</CardTitle>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleAddEvent" class="space-y-4">
              <div>
                <label class="text-sm font-medium mb-2 block">Type</label>
                <Select v-model="newEvent.type" class="w-full">
                  <option
                    v-for="type in eventTypes"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </Select>
              </div>
              <div>
                <label class="text-sm font-medium mb-2 block">Titre</label>
                <Input v-model="newEvent.titre" required />
              </div>
              <div>
                <label class="text-sm font-medium mb-2 block">Date</label>
                <Input v-model="newEvent.date" type="date" required />
              </div>
              <div>
                <label class="text-sm font-medium mb-2 block">Description</label>
                <Textarea v-model="newEvent.description" />
              </div>
              <div>
                <label class="text-sm font-medium mb-2 block">Compte-rendu</label>
                <Textarea v-model="newEvent.compteRendu" />
              </div>
              <Button type="submit">Ajouter</Button>
            </form>
          </CardContent>
        </Card>

        <div v-if="evenements.length === 0" class="text-center py-8 text-muted-foreground">
          Aucun événement enregistré
        </div>

        <div v-else class="space-y-4">
          <Card
            v-for="evenement in evenements"
            :key="evenement.id"
          >
            <CardHeader>
              <div class="flex justify-between items-start">
                <div>
                  <CardTitle>{{ evenement.titre }}</CardTitle>
                  <CardDescription>
                    <Badge>{{ getEventTypeLabel(evenement.type) }}</Badge>
                    <span class="ml-2">{{ formatDate(evenement.date) }}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div v-if="evenement.description" class="mb-2">
                <p class="text-sm">{{ evenement.description }}</p>
              </div>
              <div v-if="evenement.compteRendu" class="mb-2">
                <p class="text-sm font-medium">Compte-rendu:</p>
                <p class="text-sm whitespace-pre-wrap">{{ evenement.compteRendu }}</p>
              </div>
              <div v-if="evenement.documents && evenement.documents.length > 0" class="mt-4">
                <p class="text-sm font-medium mb-2">Documents:</p>
                <ul class="list-disc list-inside">
                  <li
                    v-for="doc in evenement.documents"
                    :key="doc.id"
                    class="text-sm"
                  >
                    {{ doc.nomFichier }}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

