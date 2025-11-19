/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const ElevesController = () => import('#controllers/eleves_controller')
const EvenementsController = () => import('#controllers/evenements_controller')
const GroupesController = () => import('#controllers/groupes_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth routes
router.post('/signup', [AuthController, 'signup']).use(middleware.guest())
router.post('/login', [AuthController, 'login']).use(middleware.guest())
router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
router.get('/me', [AuthController, 'me']).use(middleware.auth())

// Élèves routes
router
  .group(() => {
    router.get('/eleves', [ElevesController, 'index'])
    router.post('/eleves', [ElevesController, 'store'])
    router.get('/eleves/:id', [ElevesController, 'show'])
    router.put('/eleves/:id', [ElevesController, 'update'])
  })
  .use(middleware.auth())
  .use(middleware.enseignant())

// Événements routes
router
  .group(() => {
    router.get('/eleves/:id/evenements', [EvenementsController, 'index'])
    router.post('/eleves/:id/evenements', [EvenementsController, 'store'])
    router.get('/evenements/:id', [EvenementsController, 'show'])
    router.put('/evenements/:id', [EvenementsController, 'update'])
    router.post('/evenements/:id/documents', [EvenementsController, 'uploadDocument'])
  })
  .use(middleware.auth())
  .use(middleware.enseignant())

// Groupes routes
router
  .group(() => {
    router.get('/groupes', [GroupesController, 'index'])
    router.post('/groupes', [GroupesController, 'store'])
    router.get('/groupes/:id', [GroupesController, 'show'])
    router.put('/groupes/:id', [GroupesController, 'update'])
    router.post('/groupes/:id/ajouter-eleve', [GroupesController, 'ajouterEleve'])
    router.post('/groupes/:id/retirer-eleve', [GroupesController, 'retirerEleve'])
  })
  .use(middleware.auth())
  .use(middleware.enseignant())
