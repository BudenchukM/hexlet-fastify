export const routes = {
  home: () => '/',
  
  // Пользователи
  users: () => '/users',
  newUser: () => '/users/new',
  user: id => `/users/${id}`,
  editUser: id => `/users/${id}/edit`,

  // Курсы
  courses: () => '/courses',
  newCourse: () => '/courses/new',
  course: id => `/courses/${id}`,
}
