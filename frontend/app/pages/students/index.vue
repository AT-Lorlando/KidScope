<script setup lang="ts">
import type { Student } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const studentsStore = useStudentsStore()
const router = useRouter()

const students = ref<Student[]>([])
const loading = ref(false)
const searchTerm = ref('')
const levelFilter = ref<string | null>(null)

const levels = [
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
    await studentsStore.fetchAll()
    students.value = studentsStore.students
  } catch (error) {
    console.error('Error loading students:', error)
  } finally {
    loading.value = false
  }
})

const filteredStudents = computed(() => {
  let filtered = students.value

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(
      (student: Student) =>
        student.lastName.toLowerCase().includes(term) ||
        student.firstName.toLowerCase().includes(term)
    )
  }

  if (levelFilter.value) {
    filtered = filtered.filter((student: Student) => student.level === levelFilter.value)
  }

  return filtered
})

const goToStudent = (id: number) => {
  router.push(`/students/${id}`)
}
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Liste des élèves</h1>
      <Button @click="router.push('/groups')">Voir les groupes</Button>
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
            <Select :model-value="levelFilter || 'all'" @update:model-value="(val) => levelFilter = val === 'all' ? null : val">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Tous les niveaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem v-for="level in levels" :key="level" :value="level">
                  {{ level }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <div v-if="loading" class="text-center py-8">Chargement...</div>

    <div v-else-if="filteredStudents.length === 0" class="text-center py-8 text-muted-foreground">
      Aucun élève trouvé
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        v-for="student in filteredStudents"
        :key="student.id"
        class="cursor-pointer hover:shadow-lg transition-shadow"
        @click="goToStudent(student.id)"
      >
        <CardHeader>
          <CardTitle>{{ student.firstName }} {{ student.lastName }}</CardTitle>
          <CardDescription>
            <Badge>{{ student.level }}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Né(e) le {{ new Date(student.birthdate).toLocaleDateString('fr-FR') }}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

