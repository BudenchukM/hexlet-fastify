import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import formbody from '@fastify/formbody'

import registerUserRoutes from './src/routes/users.js'
import registerCourseRoutes from './src/routes/courses.js'
import { routes } from './src/routes.js'

const app = fastify()
const state = { users: [], courses: [], routes }

await app.register(formbody)
await app.register(view, { engine: { pug }, root: './src/views' })

registerUserRoutes(app, state)
registerCourseRoutes(app, state)

app.get(routes.home(), (req, reply) => reply.view('index', { routes }))

app.listen({ port: 3000 }, () => console.log('Server running on http://localhost:3000'))
