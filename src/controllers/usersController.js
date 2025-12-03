import _ from 'lodash'

export const getUsers = (state) => (req, reply) => {
  reply.view('users/index', { 
    users: state.users, 
    routes: state.routes, 
    flash: reply.flash() 
  })
}

export const getNewUserForm = (state) => (req, reply) => {
  reply.view('users/new', { 
    name: '', 
    email: '', 
    password: '', 
    routes: state.routes, 
    flash: reply.flash() 
  })
}

export const createUser = (state) => (req, reply) => {
  const { name, email, password } = req.body
  const user = { id: _.uniqueId(), name, email, password }
  state.users.push(user)

  req.flash('success', 'Пользователь успешно создан!')
  reply.redirect(state.routes.users())
}

export const getUser = (state) => (req, reply) => {
  const user = state.users.find(u => u.id === parseInt(req.params.id))
  if (!user) {
    req.flash('error', 'Пользователь не найден')
    return reply.redirect(state.routes.users())
  }
  reply.view('users/show', { user, routes: state.routes, flash: reply.flash() })
}

export const getEditUserForm = (state) => (req, reply) => {
  const user = state.users.find(u => u.id === parseInt(req.params.id))
  if (!user) {
    req.flash('error', 'Пользователь не найден')
    return reply.redirect(state.routes.users())
  }
  reply.view('users/edit', { user, routes: state.routes, flash: reply.flash() })
}

export const updateUser = (state) => (req, reply) => {
  const index = state.users.findIndex(u => u.id === parseInt(req.params.id))
  if (index === -1) {
    req.flash('error', 'Пользователь не найден')
    return reply.redirect(state.routes.users())
  }

  const { name, email } = req.body
  state.users[index] = { ...state.users[index], name, email }

  req.flash('success', 'Пользователь обновлён')
  reply.redirect(state.routes.users())
}

export const deleteUser = (state) => (req, reply) => {
  const index = state.users.findIndex(u => u.id === parseInt(req.params.id))
  if (index === -1) {
    req.flash('error', 'Пользователь не найден')
    return reply.redirect(state.routes.users())
  }

  state.users.splice(index, 1)
  req.flash('success', 'Пользователь удалён')
  reply.redirect(state.routes.users())
}
