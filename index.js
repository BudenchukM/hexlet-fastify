import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import formbody from '@fastify/formbody'
import fastifyCookie from '@fastify/cookie'
import session from '@fastify/session'
import flash from '@fastify/flash'

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
await app.register(flash) // флеш-сообщения

// Регистрация CRUD маршрутов
registerUserRoutes(app, state)
registerCourseRoutes(app, state)

// ===== Главная =====
app.get(routes.home(), (req, reply) => {
  const visited = req.cookies.visited === 'true'
  const templateData = { 
    routes, 
    visited, 
    userId: req.session.userId,
    flash: reply.flash()
  }
  reply.cookie('visited', true, { path: '/', httpOnly: true })
  reply.view('index', templateData)
})

// ===== Аутентификация =====

// Форма логина
app.get('/login', (req, reply) => {
  reply.view('login', { routes, error: null, flash: reply.flash() })
})

// Процесс логина
app.post('/login', (req, reply) => {
  const { email, password } = req.body
  const user = state.users.find(u => u.email === email)
  
  if (user) {
    req.session.userId = user.id
    req.flash('success', 'Вы успешно вошли!')
    reply.redirect(routes.home())
  } else {
    req.flash('error', 'Пользователь не найден')
    reply.redirect('/login')
  }
})

// Процесс выхода
app.post('/logout', (req, reply) => {
  req.session.delete() // удаляем сессию
  req.flash('success', 'Вы вышли из системы')
  reply.redirect(routes.home())
})

app.listen({ port: 3000 }, () => console.log('Server running on http://localhost:3000'))
