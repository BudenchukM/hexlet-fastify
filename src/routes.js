export const routes = {
  // Главная
  home: () => '/',

  // Пользователи (новый путь)
  users: () => '/u',
  newUser: () => '/u/new',
  user: id => `/u/${id}`,
  userPost: (id, postId) => `/u/${id}/post/${postId}`,

  // Курсы (новый путь)
  courses: () => '/c',
  newCourse: () => '/c/new',
  course: id => `/c/${id}`,

  // Прочие
  safeUser: () => '/safe-user',
  unsafeUser: () => '/unsafe-user',
  hello: () => '/hello',
}
