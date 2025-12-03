import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import formbody from '@fastify/formbody'
import fastifyCookie from '@fastify/cookie'
import session from '@fastify/session'

import registerUserRoutes from './src/routes/users.js'
import registerCourseRoutes from './src/routes/courses.js'
import { routes } from './src/routes.js'

const app = fastify()
const state = { users: [], courses: [], routes }

await app.register(formbody)
await app.register(view, { engine: { pug }, root: './src/views' })
await app.register(fastifyCookie)
await app.register(session, {
  secret: 'a_very_secret_key_of_at_least_32_chars!', // минимум 32 символа
  cookie: { secure: false }, // false для http (не https)
})

// Регистрация CRUD маршрутов
registerUserRoutes(app, state)
registerCourseRoutes(app, state)

// ===== Главная =====
app.get(routes.home(), (req, reply) => {
  const visited = req.cookies.visited === 'true'
  const templateData = { routes, visited, userId: req.session.userId }
  reply.cookie('visited', true, { path: '/', httpOnly: true })
  reply.view('index', templateData)
})

// ===== Аутентификация =====

// Форма логина
app.get('/login', (req, reply) => {
  reply.view('login', { routes, error: null })
})

// Процесс логина
app.post('/login', (req, reply) => {
  const { email, password } = req.body
  const user = state.users.find(u => u.email === email)
  
  if (user) {
    // В реальном проекте проверяем hash пароля
    req.session.userId = user.id
    reply.redirect(routes.home())
  } else {
    reply.view('login', { routes, error: 'Пользователь не найден' })
  }
})

// Процесс выхода
app.post('/logout', (req, reply) => {
  req.destroySession(err => {
    reply.redirect(routes.home())
  })
})

app.listen({ port: 3000 }, () => console.log('Server running on http://localhost:3000'))
