import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import sanitize from 'sanitize-html'
import formbody from '@fastify/formbody'
import _ from 'lodash'
import * as yup from 'yup'

import getUsers from './utils.js'
import { routes } from './routes.js'

const app = fastify()
const port = 3000

// ===== Плагины =====
await app.register(formbody)
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

// ===== Главная =====
app.get(routes.home(), (req, reply) => {
  reply.view('index', { routes })
})

/* =======================
   Пользователи
==========================*/

// GET /users — список
app.get(routes.users(), (req, reply) => {
  const page = parseInt(req.query.page, 10) || 1
  const per = parseInt(req.query.per, 10) || 5
  const start = (page - 1) * per
  const end = start + per

  const pageUsers = state.users.slice(start, end)
  reply.view('users/index', { users: pageUsers, page, per, routes })
})

// GET /users/new — форма
app.get(routes.newUser(), (req, reply) => {
  reply.view('users/new', { name: '', email: '', password: '', passwordConfirmation: '', routes })
})

// POST /users — yup валидация
app.post(routes.users(), {
  attachValidation: true,
  schema: {
    body: yup.object({
      name: yup.string().min(2, 'Имя должно быть не меньше 2 символов').required('Имя обязательно'),
      email: yup.string().email('Некорректный email').required('Email обязателен'),
      password: yup.string().min(5, 'Пароль должен быть не короче 5 символов').required('Пароль обязателен'),
      passwordConfirmation: yup.string().required('Подтверждение пароля обязательно'),
    })
  },
  validatorCompiler: ({ schema }) => (data) => {
    if (data.password !== data.passwordConfirmation) {
      return { error: new Error('Пароли не совпадают') }
    }
    try {
      const result = schema.validateSync(data)
      return { value: result }
    } catch (e) {
      return { error: e }
    }
  }
}, (req, reply) => {
  const { name, email, password, passwordConfirmation } = req.body

  if (req.validationError) {
    return reply.view('users/new', {
      name,
      email,
      password,
      passwordConfirmation,
      error: req.validationError,
      routes
    })
  }

  const user = {
    id: _.uniqueId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  }

  state.users.push(user)
  reply.redirect(routes.users())
})

/* =======================
   Курсы
==========================*/

// GET /courses — список + поиск
app.get(routes.courses(), (req, reply) => {
  const term = (req.query.term || '').toLowerCase()
  let filtered = state.courses

  if (term) {
    filtered = filtered.filter(
      c => c.title.toLowerCase().includes(term) || c.description.toLowerCase().includes(term)
    )
  }

  reply.view('courses/index', { courses: filtered, term, routes })
})

// GET /courses/new
app.get(routes.newCourse(), (req, reply) => {
  reply.view('courses/new', { title: '', description: '', routes })
})

// POST /courses — yup валидация
app.post(routes.courses(), {
  attachValidation: true,
  schema: {
    body: yup.object({
      title: yup.string().min(2, 'Название должно быть не менее 2 символов').required('Название обязательно'),
      description: yup.string().min(10, 'Описание должно быть не менее 10 символов').required('Описание обязательно'),
    })
  },
  validatorCompiler: ({ schema }) => (data) => {
    try {
      const result = schema.validateSync(data)
      return { value: result }
    } catch (e) {
      return { error: e }
    }
  }
}, (req, reply) => {
  const { title, description } = req.body

  if (req.validationError) {
    return reply.view('courses/new', {
      title,
      description,
      error: req.validationError,
      routes
    })
  }

  const course = {
    id: _.uniqueId(),
    title: title.trim(),
    description: description.trim(),
  }

  state.courses.push(course)
  reply.redirect(routes.courses())
})

// GET /courses/:id — просмотр курса
app.get(routes.course(':id'), (req, reply) => {
  const { id } = req.params
  const course = state.courses.find(c => c.id === parseInt(id, 10))

  if (!course) return reply.code(404).send({ message: 'Course not found' })

  reply.view('courses/show', { course, routes })
})

/* =======================
   Прочие маршруты
==========================*/

app.get(routes.safeUser(), (req, reply) => {
  const id = req.query.id || ''
  const sanitized = sanitize(id)
  reply.type('html').send(`<h1>${sanitized}</h1>`)
})

app.get(routes.unsafeUser(), (req, reply) => {
  const { id } = req.query
  reply.view('unsafeUser', { id, routes })
})

app.get(routes.userPost(':id', ':postId'), (req, reply) => {
  const { id, postId } = req.params
  reply.send(`User ID: ${id}; Post ID: ${postId}`)
})

app.get(routes.hello(), (req, reply) => {
  const name = req.query.name || 'World'
  reply.send(`Hello, ${name}!\n`)
})

// ===== Запуск =====
app.listen({ port }, () => {
  console.log(`Server running at http://localhost:${port}`)
})
