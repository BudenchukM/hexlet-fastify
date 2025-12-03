import _ from 'lodash'

export const getCourses = (state) => (req, reply) => {
  reply.view('courses/index', { courses: state.courses, routes: state.routes })
}

export const getNewCourseForm = (state) => (req, reply) => {
  reply.view('courses/new', { title: '', description: '', routes: state.routes })
}

export const createCourse = (state) => (req, reply) => {
  const { title, description } = req.body
  const course = { id: _.uniqueId(), title, description }
  state.courses.push(course)
  reply.redirect(state.routes.courses())
}

export const getCourse = (state) => (req, reply) => {
  const course = state.courses.find(c => c.id === parseInt(req.params.id))
  if (!course) return reply.code(404).send({ message: 'Course not found' })
  reply.view('courses/show', { course, routes: state.routes })
}
