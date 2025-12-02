import fastify from 'fastify'

const app = fastify()
const port = 3000

// GET /users
app.get('/users', (req, res) => {
  res.send('GET /users')
})

// POST /users
app.post('/users', (req, res) => {
  res.send('POST /users')
})

// GET /
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// GET /hello с параметром name
app.get('/hello', (req, res) => {
  const name = req.query.name || 'World'
  res.send(`Hello, ${name}!\n`)
})

// 🔥 Динамический маршрут users/{id}/post/{postId}
app.get('/users/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params
  res.send(`User ID: ${id}; Post ID: ${postId}`)
})

// Запуск сервера
app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
})
