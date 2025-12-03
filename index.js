import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import formbody from '@fastify/formbody'
import fastifyCookie from '@fastify/cookie'

import registerUserRoutes from './src/routes/users.js'
import registerCourseRoutes from './src/routes/courses.js'
import { routes } from './src/routes.js'

const app = fastify()
const state = { users: [], courses: [], routes }

// ===== Плагины =====
await app.register(formbody)
await app.register(view, { engine: { pug }, root: './src/views' })
await app.register(fastifyCookie)

// ===== Маршруты CRUD =====
registerUserRoutes(app, state)
registerCourseRoutes(app, state)

// ===== Главная с куками =====
app.get(routes.home(), (req, reply) => {
  const visited = req.cookies.visited === 'true' // кука хранится как строка
  const templateData = { routes, visited }

  // Устанавливаем куку для последующих заходов
  reply.cookie('visited', true, {
    path: '/',
    httpOnly: true,
  })

  reply.view('index', templateData)
})

// ===== Запуск сервера =====
app.listen({ port: 3000 }, () => {
  console.log('Server running on http://localhost:3000')
})
