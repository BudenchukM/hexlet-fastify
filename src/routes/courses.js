import { getCourses, getNewCourseForm, createCourse, getCourse } from '../controllers/coursesController.js'
import { routes } from '../routes.js'

export default function registerCourseRoutes(app, state) {
  state.routes = routes

  app.get(routes.courses(), getCourses(state))
  app.get(routes.newCourse(), getNewCourseForm(state))
  app.post(routes.courses(), createCourse(state))
  app.get(routes.course(':id'), getCourse(state))
}
