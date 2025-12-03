import _ from 'lodash'

export const getUsers = (state) => (req, reply) => {
  reply.view('users/index', { users: state.users, routes: state.routes })
}

export const getNewUserForm = (state) => (req, reply) => {
  reply.view('users/new', { name: '', email: '', password: '', routes: state.routes })
}

export const createUser = (state) => (req, reply) => {
  const { name, email, password } = req.body
  const user = { id: _.uniqueId(), name, email, password }
  state.users.push(user)
  reply.redirect(state.routes.users())
}

export const getUser = (state) => (req, reply) => {
  const user = state.users.find(u => u.id === parseInt(req.params.id))
  if (!user) return reply.code(404).send({ message: 'User not found' })
  reply.view('users/show', { user, routes: state.routes })
}

export const getEditUserForm = (state) => (req, reply) => {
  const user = state.users.find(u => u.id === parseInt(req.params.id))
  if (!user) return reply.code(404).send({ message: 'User not found' })
  reply.view('users/edit', { user, routes: state.routes })
}

export const updateUser = (state) => (req, reply) => {
  const index = state.users.findIndex(u => u.id === parseInt(req.params.id))
  if (index === -1) return reply.code(404).send({ message: 'User not found' })

  const { name, email } = req.body
  state.users[index] = { ...state.users[index], name, email }
  reply.redirect(state.routes.users())
}

export const deleteUser = (state) => (req, reply) => {
  const index = state.users.findIndex(u => u.id === parseInt(req.params.id))
  if (index === -1) return reply.code(404).send({ message: 'User not found' })
  state.users.splice(index, 1)
  reply.redirect(state.routes.users())
}
