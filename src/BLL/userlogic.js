import { getFromStorage } from '../DAL/utils'
import { showProfile } from '../PLL/adminPLL'
import { User } from '../DAL/User'
import { init } from '../PLL/app'

export function getCurrentUser(login = '', password = '') {
  const users = getFromStorage('users')
  for (let user of users) {
    if (user.login === login && user.password === password) setCookie(user.id)
    if (user.id === checkCookie()) return user
  }
}


export function signIn() {
  const signInForm = document.querySelector('#app-login-form')
  if (getFromStorage('users').length === 0)
    document.querySelector('#app-login-btn').innerText = 'Register'

  signInForm.addEventListener('submit', function (e) {
    e.preventDefault()
    const formData = new FormData(signInForm)
    const login = formData.get('login')
    const password = formData.get('password')
    if (login !== '' && password !== '') {
      if (getFromStorage('users').length === 0)
        createUser(login, password, true)
      if (authUser(login, password)) getCurrentUser(login, password)
      else console.log('access denied')
      location.reload()
    }
  })
}

export function signUp() {
  const signUpForm = document.querySelector('#app-login-form')
  if (signUpForm)
    signUpForm.addEventListener('submit', function (e) {
      e.preventDefault()
      const formData = new FormData(signUpForm)
      const login = formData.get('login')
      const password = formData.get('password')
      if (login !== '' && password !== '') {
        createUser(login, password)
        showProfile()
      }
    })
}

function setCookie(id) {
  document.cookie = `userId=${id}`
}

function createUser(login, password, rights = false) {
  const user = new User(login, password)
  if (login === 'admin' || rights) user.isAdmin = true
  User.save(user)
}

export function manageUser(link) {
  if (link.dataset.user === 'profile') showProfile()
  else if (link.dataset.user === 'logout') userLogout()
  else if (link.dataset.user === 'tasks') init()
}

function userLogout() {
  setCookie('')
  location.reload()
}

export function checkCookie() {
  if (
    document.cookie.split(';').some(item => item.trim().startsWith('userId='))
  ) {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('userId='))
      .split('=')[1]

    return cookieValue
  }
}

export const authUser = function (login, password) {
  const user = new User(login, password)
  if (!user.hasAccess) return false
  return true
}
