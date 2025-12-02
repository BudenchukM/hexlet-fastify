import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import _ from 'lodash'
import getUsers from './utils.js'

const app = fastify()
const port = 3000

// Подключаем Pug с указанием корневого каталога шаблонов
await app.register(view, {
  engine: { pug },
  root: './src/views', // каталог с шаблонами
})

// ===== Главная страница через Pug =====
app.get('/', (req, reply) => {
  reply.view('index')
})

// ===== Список пользователей с пейджингом =====
const users = getUsers() // функция из utils.js

app.get('/users', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1
  const per = parseInt(req.query.per, 10) || 5

  const start = (page - 1) * per
  const end = start + per
  const pageUsers = users.slice(start, end)

  res.send(pageUsers)
})

// ===== Динамический маршрут users/{id}/post/{postId} =====
app.get('/users/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params
  res.send(`User ID: ${id}; Post ID: ${postId}`)
})

// ===== POST /users =====
app.post('/users', (req, res) => {
  res.send('POST /users')
})

// ===== GET /hello с параметром name =====
app.get('/hello', (req, res) => {
  const name = req.query.name || 'World'
  res.send(`Hello, ${name}!\n`)
})

// ===== Пример курсов (для Pug) =====
const state = {
  courses: [
    { id: 1, title: 'JS: Массивы', description: 'Курс про массивы' },
    { id: 2, title: 'JS: Функции', description: 'Курс про функции' },
  ],
}

app.get('/courses', (req, res) => {
  res.view('courses/index', { courses: state.courses, header: 'Курсы по программированию' })
})

app.get('/courses/:id', (req, res) => {
  const { id } = req.params
  const course = state.courses.find(c => c.id === parseInt(id, 10))
  if (!course) {
    res.code(404).send({ message: 'Course not found' })
    return
  }
  res.view('courses/show', { course })
})

// ===== Запуск сервера =====
app.listen({ port }, () => {
  console.log(`Server running at http://localhost:${port}`)
})
