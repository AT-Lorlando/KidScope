<script setup lang="ts">
import type { Student, Event, EventType } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const studentsStore = useStudentsStore()
const eventsStore = useEventsStore()

const studentId = computed(() => Number(route.params.id))
const student = ref<Student | null>(null)
const events = ref<Event[]>([])
const loading = ref(false)
const showAddEventForm = ref(false)
const editingEventId = ref<number | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedEventForUpload = ref<Event | null>(null)

const newEvent = ref({
  type: 'pedagogical_follow_up' as EventType,
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  report: '',
})

const eventTypes = [
  { value: 'discipline', label: 'Discipline' },
  { value: 'convocation', label: 'Convocation' },
  { value: 'orientation', label: 'Orientation' },
  { value: 'parent_meeting', label: 'Rencontre parent' },
  { value: 'pedagogical_follow_up', label: 'Suivi pédagogique' },
]

onMounted(async () => {
  loading.value = true
  try {
    student.value = await studentsStore.fetchById(studentId.value)
    events.value = await eventsStore.fetchByStudent(studentId.value)
  } catch (error) {
    console.error('Error loading:', error)
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

    const eventData = {
      ...newEvent.value,
      date,
    }

    if (editingEventId.value) {
      await eventsStore.update(editingEventId.value, eventData)
    } else {
      await eventsStore.create(studentId.value, eventData)
    }

    events.value = await eventsStore.fetchByStudent(studentId.value)
    cancelEdit()
  } catch (error) {
    console.error('Error saving event:', error)
  }
}

const startEdit = (event: Event) => {
  editingEventId.value = event.id
  newEvent.value = {
    type: event.type,
    title: event.title,
    description: event.description || '',
    date: event.date.split('T')[0], // Assumes date is ISO string
    report: event.report || '',
  }
  showAddEventForm.value = true
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  showAddEventForm.value = false
  editingEventId.value = null
  newEvent.value = {
    type: 'pedagogical_follow_up',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    report: '',
  }
}

const triggerFileInput = (event: Event) => {
  selectedEventForUpload.value = event
  fileInput.value?.click()
}

const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files || !files.length || !selectedEventForUpload.value) return

  try {
    await eventsStore.uploadDocument(selectedEventForUpload.value.id, files[0])
    events.value = await eventsStore.fetchByStudent(studentId.value)
  } catch (error) {
    console.error('Error uploading file:', error)
  } finally {
    if (fileInput.value) fileInput.value.value = ''
    selectedEventForUpload.value = null
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const getEventTypeLabel = (type: string) => {
  return eventTypes.find((t) => t.value === type)?.label || type
}

const config = useRuntimeConfig()
const getDocUrl = (path: string) => {
  // Remove leading slash if present to avoid double slashes with apiBase
  const cleanPath = path.startsWith('/') ? path.substring(1) : path
  // Ensure apiBase doesn't have trailing slash if we add one (or rely on cleanPath)
  const apiBase = config.public.apiBase.replace(/\/$/, '')
  return `${apiBase}/${cleanPath}`
}
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <Button variant="ghost" class="mb-4" @click="router.push('/students')">
      ← Retour à la liste
    </Button>

    <div v-if="loading" class="text-center py-8">Chargement...</div>

    <div v-else-if="student">
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>{{ student.firstName }} {{ student.lastName }}</CardTitle>
          <CardDescription>
            <Badge>{{ student.level }}</Badge>
            <span class="ml-2">
              Né(e) le {{ formatDate(student.birthdate) }}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>

      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Événements</h2>
          <Button @click="editingEventId ? cancelEdit() : (showAddEventForm = !showAddEventForm)">
            {{ showAddEventForm ? 'Annuler' : 'Ajouter un événement' }}
          </Button>
        </div>

        <Card v-if="showAddEventForm" class="mb-4 border-primary">
          <CardHeader>
            <CardTitle>{{ editingEventId ? 'Modifier l\'événement' : 'Nouvel événement' }}</CardTitle>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleAddEvent" class="space-y-4">
              <div>
                <label class="text-sm font-medium mb-2 block">Type</label>
                <Select v-model="newEvent.type">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="type in eventTypes"
                      :key="type.value"
                      :value="type.value"
                    >
                      {{ type.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label class="text-sm font-medium mb-2 block">Titre</label>
                <Input v-model="newEvent.title" required />
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
                <Textarea v-model="newEvent.report" />
              </div>
              <div class="flex gap-2">
                <Button type="submit">{{ editingEventId ? 'Enregistrer' : 'Ajouter' }}</Button>
                <Button type="button" variant="outline" @click="cancelEdit">Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div v-if="events.length === 0" class="text-center py-8 text-muted-foreground">
          Aucun événement enregistré
        </div>

        <div v-else class="space-y-4">
          <Card
            v-for="event in events"
            :key="event.id"
            :class="{ 'border-primary': editingEventId === event.id }"
          >
            <CardHeader>
              <div class="flex justify-between items-start">
                <div>
                  <CardTitle>{{ event.title }}</CardTitle>
                  <CardDescription>
                    <Badge>{{ getEventTypeLabel(event.type) }}</Badge>
                    <span class="ml-2">{{ formatDate(event.date) }}</span>
                  </CardDescription>
                </div>
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" @click="startEdit(event)">
                    ✏️ Éditer
                  </Button>
                  <Button variant="outline" size="sm" @click="triggerFileInput(event)">
                    📎 Ajouter doc
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div v-if="event.description" class="mb-2">
                <p class="text-sm">{{ event.description }}</p>
              </div>
              <div v-if="event.report" class="mb-2">
                <p class="text-sm font-medium">Compte-rendu:</p>
                <p class="text-sm whitespace-pre-wrap">{{ event.report }}</p>
              </div>
              <div v-if="event.documents && event.documents.length > 0" class="mt-4">
                <p class="text-sm font-medium mb-2">Documents:</p>
                <ul class="list-disc list-inside">
                  <li
                    v-for="doc in event.documents"
                    :key="doc.id"
                    class="text-sm flex items-center gap-2"
                  >
                    <a :href="getDocUrl(doc.storageUrl)" target="_blank" class="text-blue-600 hover:underline">
                      {{ doc.fileName }}
                    </a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    
    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      @change="handleFileUpload"
    />
  </div>
</template>
