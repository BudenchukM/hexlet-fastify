import { getUsers, getNewUserForm, createUser, getUser, getEditUserForm, updateUser, deleteUser } from '../controllers/usersController.js'
import { routes } from '../routes.js'

export default function registerUserRoutes(app, state) {
  state.routes = routes

  app.get(routes.users(), getUsers(state))
  app.get(routes.newUser(), getNewUserForm(state))
  app.post(routes.users(), createUser(state))
  app.get(routes.user(':id'), getUser(state))
  app.get(routes.editUser(':id'), getEditUserForm(state))
  app.put(routes.user(':id'), updateUser(state))
  app.patch(routes.user(':id'), updateUser(state))
  app.delete(routes.user(':id'), deleteUser(state))
}
