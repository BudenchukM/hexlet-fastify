import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'

const app = fastify()
const port = 3000

// Подключаем Pug
await app.register(view, {
  engine: { pug },
  root: './src/views'  // каталог с шаблонами
})

// Главная страница через Pug
app.get('/', (req, reply) => {
  reply.view('index')  // файл src/views/index.pug
})

// GET /users
app.get('/users', (req, res) => {
  res.send('GET /users')
})

// POST /users
app.post('/users', (req, res) => {
  res.send('POST /users')
})

// GET /hello с параметром name
app.get('/hello', (req, res) => {
  const name = req.query.name || 'World'
  res.send(`Hello, ${name}!\n`)
})

// Динамический маршрут users/{id}/post/{postId}
app.get('/users/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params
  res.send(`User ID: ${id}; Post ID: ${postId}`)
})

// Запуск сервера (только один раз!)
app.listen({ port }, () => {
  console.log(`Server running at http://localhost:${port}`)
})
