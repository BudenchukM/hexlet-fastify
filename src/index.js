import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import sanitize from 'sanitize-html'
import formbody from '@fastify/formbody'
import _ from 'lodash'

// Вспомогательная функция для получения пользователей
import getUsers from './utils.js'

const app = fastify()
const port = 3000

// ===== Плагин для парсинга форм =====
await app.register(formbody)

// ===== Подключаем Pug =====
await app.register(view, {
  engine: { pug },
  root: './src/views',
})

// ===== Хранилище данных =====
const state = {
  users: getUsers(),
  courses: [
    { id: 1, title: 'JS: Массивы', description: 'Курс про массивы' },
    { id: 2, title: 'JS: Функции', description: 'Курс про функции' },
    { id: 3, title: 'JS: Объекты', description: 'Курс про объекты' },
  ],
}

// ===== Главная страница =====
app.get('/', (req, reply) => {
  reply.view('index')
})

/* =======================
   Пользователи
==========================*/

// GET /users — список пользователей с пейджингом
app.get('/users', (req, reply) => {
  const page = parseInt(req.query.page, 10) || 1
  const per = parseInt(req.query.per, 10) || 5
  const start = (page - 1) * per
  const end = start + per

  const pageUsers = state.users.slice(start, end)
  reply.view('users/index', { users: pageUsers, page, per })
})

// GET /users/new — форма создания нового пользователя
app.get('/users/new', (req, reply) => {
  reply.view('users/new')
})

// POST /users — обработка формы добавления пользователя
app.post('/users', (req, reply) => {
  const { name, email, password, passwordConfirmation } = req.body

  // Валидация
  if (!name || !email || !password || !passwordConfirmation) {
    reply.code(400).send({ message: 'Все поля обязательны' })
    return
  }

  if (password !== passwordConfirmation) {
    reply.code(400).send({ message: 'Пароли не совпадают' })
    return
  }

  const user = {
    id: _.uniqueId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password, // на практике пароли нужно хэшировать!
  }

  state.users.push(user)

  reply.redirect('/users')
})

// GET /safe-user — безопасный вывод данных через sanitize
app.get('/safe-user', (req, reply) => {
  const id = req.query.id || ''
  const sanitized = sanitize(id)
  reply.type('html').send(`<h1>${sanitized}</h1>`)
})

// GET /unsafe-user — передача в Pug (авто-экранирование)
app.get('/unsafe-user', (req, reply) => {
  const { id } = req.query
  reply.view('unsafeUser', { id })
})

// GET /users/:id/post/:postId — динамический маршрут
app.get('/users/:id/post/:postId', (req, reply) => {
  const { id, postId } = req.params
  reply.send(`User ID: ${id}; Post ID: ${postId}`)
})

/* =======================
   Курсы
==========================*/

// GET /courses — список курсов с поиском
app.get('/courses', (req, reply) => {
  const term = (req.query.term || '').toLowerCase()
  let filteredCourses = state.courses

  if (term) {
    filteredCourses = state.courses.filter(
      course =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term)
    )
  }

  reply.view('courses/index', { courses: filteredCourses, term })
})

// GET /courses/new — форма создания нового курса
app.get('/courses/new', (req, reply) => {
  reply.view('courses/new')
})

// POST /courses — обработка формы добавления курса
app.post('/courses', (req, reply) => {
  const { title, description } = req.body

  if (!title || !description) {
    reply.code(400).send('Название и описание обязательны')
    return
  }

  const course = {
    id: _.uniqueId(),
    title: title.trim(),
    description: description.trim(),
  }

  state.courses.push(course)

  reply.redirect('/courses')
})

// GET /courses/:id — страница конкретного курса
app.get('/courses/:id', (req, reply) => {
  const { id } = req.params
  const course = state.courses.find(c => c.id === parseInt(id, 10))

  if (!course) {
    reply.code(404).send({ message: 'Course not found' })
    return
  }

  reply.view('courses/show', { course })
})

/* =======================
   Прочие маршруты
==========================*/

// GET /hello
app.get('/hello', (req, reply) => {
  const name = req.query.name || 'World'
  reply.send(`Hello, ${name}!\n`)
})

// ===== Запуск сервера =====
app.listen({ port }, () => {
  console.log(`Server running at http://localhost:${port}`)
})
