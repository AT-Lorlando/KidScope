<script setup lang="ts">
import type { Group, Student } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const groupsStore = useGroupsStore()
const studentsStore = useStudentsStore()

const groupId = computed(() => Number(route.params.id))
const group = ref<Group | null>(null)
const allStudents = ref<Student[]>([])
const loading = ref(false)
const showAddForm = ref(false)
const searchTerm = ref('')

onMounted(async () => {
  loading.value = true
  try {
    group.value = await groupsStore.fetchById(groupId.value)
    allStudents.value = await studentsStore.fetchAll()
  } catch (error) {
    console.error('Error loading:', error)
  } finally {
    loading.value = false
  }
})

const studentsInGroup = computed(() => {
  return group.value?.students || []
})

const studentsNotInGroup = computed(() => {
  const studentIds = new Set(studentsInGroup.value.map((s: Student) => s.id))
  let filtered = allStudents.value.filter((s: Student) => !studentIds.has(s.id))

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(
      (student: Student) =>
        student.lastName.toLowerCase().includes(term) ||
        student.firstName.toLowerCase().includes(term)
    )
  }

  return filtered
})

const handleAddStudent = async (studentId: number) => {
  try {
    await groupsStore.addStudent(groupId.value, studentId)
    group.value = await groupsStore.fetchById(groupId.value)
    searchTerm.value = ''
  } catch (error) {
    console.error('Error adding student:', error)
  }
}

const handleRemoveStudent = async (studentId: number) => {
  try {
    await groupsStore.removeStudent(groupId.value, studentId)
    group.value = await groupsStore.fetchById(groupId.value)
  } catch (error) {
    console.error('Error removing student:', error)
  }
}

const goToStudent = (id: number) => {
  router.push(`/students/${id}`)
}
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <Button variant="ghost" class="mb-4" @click="router.push('/groups')">
      ← Retour aux groupes
    </Button>

    <div v-if="loading" class="text-center py-8">Chargement...</div>

    <div v-else-if="group">
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>{{ group.name }}</CardTitle>
          <CardDescription>
            {{ studentsInGroup.length }} élève(s) dans ce groupe
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
            <div v-if="studentsNotInGroup.length === 0" class="text-sm text-muted-foreground">
              Aucun élève disponible
            </div>
            <div v-else class="space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="student in studentsNotInGroup"
                :key="student.id"
                class="flex justify-between items-center p-2 border rounded"
              >
                <div>
                  <p class="font-medium">{{ student.firstName }} {{ student.lastName }}</p>
                  <p class="text-sm text-muted-foreground">{{ student.level }}</p>
                </div>
                <Button size="sm" @click="handleAddStudent(student.id)">
                  Ajouter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div v-if="studentsInGroup.length === 0" class="text-center py-8 text-muted-foreground">
          Aucun élève dans ce groupe
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            v-for="student in studentsInGroup"
            :key="student.id"
          >
            <CardHeader>
              <div class="flex justify-between items-start">
                <div>
                  <CardTitle class="cursor-pointer hover:underline" @click="goToStudent(student.id)">
                    {{ student.firstName }} {{ student.lastName }}
                  </CardTitle>
                  <CardDescription>
                    <Badge>{{ student.level }}</Badge>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="handleRemoveStudent(student.id)"
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

