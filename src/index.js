import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import sanitize from 'sanitize-html'
import getUsers from './utils.js'

const app = fastify()
const port = 3000

// Подключаем Pug
await app.register(view, {
  engine: { pug },
  root: './src/views', // каталог с шаблонами
})

// ===== Главная =====
app.get('/', (req, reply) => {
  reply.view('index')
})

// ===== Список пользователей с пейджингом =====
const users = getUsers()

app.get('/users', (req, reply) => {
  const page = parseInt(req.query.page, 10) || 1
  const per = parseInt(req.query.per, 10) || 5

  const start = (page - 1) * per
  const end = start + per
  const pageUsers = users.slice(start, end)

  reply.send(pageUsers)
})

// ===== Безопасный вывод (sanitize) =====
app.get('/safe-user', (req, reply) => {
  const id = req.query.id || ''
  const sanitized = sanitize(id)

  reply.type('html')
  reply.send(`<h1>${sanitized}</h1>`)
})

// ===== Передача НЕ очищенных данных в Pug (Pug сам экранирует) =====
app.get('/unsafe-user', (req, reply) => {
  const { id } = req.query
  reply.view('unsafeUser', { id })
})

// ===== Динамический маршрут users/:id/post/:postId =====
app.get('/users/:id/post/:postId', (req, reply) => {
  const { id, postId } = req.params
  reply.send(`User ID: ${id}; Post ID: ${postId}`)
})

// ===== POST /users =====
app.post('/users', (req, reply) => {
  reply.send('POST /users')
})

// ===== GET /hello =====
app.get('/hello', (req, reply) => {
  const name = req.query.name || 'World'
  reply.send(`Hello, ${name}!\n`)
})

// ===== Курсы и поиск =====
const state = {
  courses: [
    { id: 1, title: 'JS: Массивы', description: 'Курс про массивы' },
    { id: 2, title: 'JS: Функции', description: 'Курс про функции' },
    { id: 3, title: 'JS: Объекты', description: 'Курс про объекты' },
  ],
}

// GET /courses с поиском
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

// GET /courses/:id
app.get('/courses/:id', (req, reply) => {
  const { id } = req.params
  const course = state.courses.find(c => c.id === parseInt(id, 10))

  if (!course) {
    reply.code(404).send({ message: 'Course not found' })
    return
  }

  reply.view('courses/show', { course })
})

// ===== Запуск сервера =====
app.listen({ port }, () => {
  console.log(`Server running at http://localhost:${port}`)
})
