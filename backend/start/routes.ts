/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import app from '@adonisjs/core/services/app'
import { sep, normalize } from 'node:path'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const StudentsController = () => import('#controllers/students_controller')
const EventsController = () => import('#controllers/events_controller')
const GroupsController = () => import('#controllers/groups_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Serve uploaded files
router.get('/uploads/*', async ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (normalizedPath.includes('..')) {
    return response.badRequest('Invalid path')
  }

  const absolutePath = app.makePath('storage', 'uploads', normalizedPath)
  return response.download(absolutePath)
})

// Auth routes
router.post('/signup', [AuthController, 'signup']).use(middleware.guest())
router.post('/login', [AuthController, 'login']).use(middleware.guest())
router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
router.get('/me', [AuthController, 'me']).use(middleware.auth())

// Students routes
router
  .group(() => {
    router.get('/students', [StudentsController, 'index'])
    router.post('/students', [StudentsController, 'store'])
    router.get('/students/:id', [StudentsController, 'show'])
    router.put('/students/:id', [StudentsController, 'update'])
  })
  .use(middleware.auth())
  .use(middleware.teacher())

// Events routes
router
  .group(() => {
    router.get('/students/:id/events', [EventsController, 'index'])
    router.post('/students/:id/events', [EventsController, 'store'])
    router.get('/events/:id', [EventsController, 'show'])
    router.put('/events/:id', [EventsController, 'update'])
    router.post('/events/:id/documents', [EventsController, 'uploadDocument'])
  })
  .use(middleware.auth())
  .use(middleware.teacher())

// Groups routes
router
  .group(() => {
    router.get('/groups', [GroupsController, 'index'])
    router.post('/groups', [GroupsController, 'store'])
    router.get('/groups/:id', [GroupsController, 'show'])
    router.put('/groups/:id', [GroupsController, 'update'])
    router.post('/groups/:id/add-student', [GroupsController, 'addStudent'])
    router.post('/groups/:id/remove-student', [GroupsController, 'removeStudent'])
  })
  .use(middleware.auth())
  .use(middleware.teacher())
