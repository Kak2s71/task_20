// import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/bootstrap.min.css'
import './styles/style.css'
import { dragAndDrop } from './services/dnd'
import taskFieldTemplate from './templates/taskField.html'
import noAccessTemplate from './templates/noAccess.html'
import loginForm from './templates/loginForm.html'
import userPanel from './templates/userPanel.html'
import editForm from './templates/editForm.html'
import userProfileTemplate from './templates/userProfile.html'
import adminProfileTemplate from './templates/adminProfile.html'
import { User } from './models/User'
import { Task } from './models/Task'
import {
  generateTestUser,
  storeUser,
  getFromStorage,
  checkCookie,
  setObject,
} from './utils'
import { State } from './state'
import { authUser } from './services/auth'

let activeTasks = 0
let finishedTasks = 0

export const appState = new State()

console.clear()

function getCurrentUser(login = '', password = '') {
  const users = getFromStorage('users')
  for (let user of users) {
    if (user.login === login && user.password === password) setCookie(user.id)
    if (user.id === checkCookie()) return user
  }
}

// generateTestUser(User)
function signIn() {
  const signInForm = document.querySelector('#app-login-form')
  signInForm.addEventListener('submit', function (e) {
    e.preventDefault()
    const formData = new FormData(signInForm)
    const login = formData.get('login')
    const password = formData.get('password')
    if (login !== '' && password !== '') {
      if (authUser(login, password)) getCurrentUser(login, password)
      else console.log('access denied')
      // else createUser(login, password)
      // getUserFromStorage()
      location.reload()
    }
  })
}
function signUp() {
  const signUpForm = document.querySelector('#app-signup-form')
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

function createUser(login, password) {
  const user = new User(login, password)
  if (login === 'admin') user.isAdmin = true
  User.save(user)
}

function checkUserAccess() {
  let fieldHTMLContent = authUser(login, password)
    ? taskFieldTemplate
    : noAccessTemplate

  document.querySelector('#content').innerHTML = fieldHTMLContent
  // document.querySelector('#reveal').innerText = `${login}`
}

function populateBoard() {
  const userTasks = {
    backlog: [],
    ready: [],
    progress: [],
    finished: [],
  }
  const tasks = getFromStorage('tasks')
  const boardBlocks = document.querySelectorAll('.board__block_tasks')

  for (let task of tasks) {
    const taskDiv = document.createElement('div')
    taskDiv.className = 'block__card'
    taskDiv.draggable = true
    taskDiv.dataset.stage = ''

    const taskTitle = document.createElement('h4')
    taskTitle.className = 'block__card_title'

    const taskDesc = document.createElement('p')
    taskDesc.className = 'block__card_desc'

    taskTitle.innerText = task.title
    taskDesc.innerText = task.description
    taskDiv.dataset.stage = task.stage
    taskDiv.id = task.id
    taskDiv.appendChild(taskTitle)
    taskDiv.appendChild(taskDesc)

    const currentUser = getCurrentUser()
    if (currentUser.isAdmin) userTasks[task.stage].push(taskDiv)
    else {
      if (task.userId === checkCookie()) userTasks[task.stage].push(taskDiv)
    }
  }
  // console.log(Object.values(userTasks))
  for (let boardBlock of boardBlocks) {
    userTasks[boardBlock.id].forEach(item => {
      boardBlock.appendChild(item)
      if (item.dataset.stage === 'finished') finishedTasks++
      else activeTasks++
    })
  }
  // console.log(activeTasks, finishedTasks)
}

function totalTasks() {
  return parseInt(activeTasks) + parseInt(finishedTasks)
}

function userMenu() {
  const userLinks = document.querySelectorAll('[data-user]')

  userLinks.forEach(link => {
    link.addEventListener('click', () => manageUser(link))
  })
}

function manageUser(link) {
  if (link.dataset.user === 'profile') showProfile()
  else if (link.dataset.user === 'logout') userLogout()
  else if (link.dataset.user === 'tasks') {
    console.log('tasks pressed')
    init()
  }
}

function manageUsers() {
  const ul = document.createElement('ul')
  ul.className = 'list__users'
  ul.dataset.users = 'users'

  const users = getFromStorage('users')
  for (const user of users) {
    // console.log(user)
    const li = document.createElement('li')
    li.className = 'userlist_user'

    const btn = document.createElement('a')
    btn.type = 'button'
    btn.className = 'btn-close mx-2 del-user'
    btn.ariaLabel = 'Close'
    li.innerText = user.login
    btn.id = user.id
    li.appendChild(btn)
    btn.addEventListener('click', e => console.log(e))
    ul.appendChild(li)
  }

  return ul
}

function deleteUser() {
  const users = getFromStorage('users')
  const index = users.findIndex(elem => this.id === elem.id)
  users.splice(index, 1)
  setObject('users', users)
  showProfile()
}

function getProfileButtons() {
  const delUsers = document.querySelectorAll('.del-user')
  if (delUsers)
    delUsers.forEach(du => {
      du.addEventListener('click', deleteUser)
    })
  signUp()
}

function showProfile() {
  const currentUser = getCurrentUser()

  document.querySelector('#content').innerHTML = userProfileTemplate
  const userProfile = document.querySelector('#user-profile')
  let profileHTML = `
  <h1 class="profile-heading">Welcome, ${currentUser.login}</h1>
<p class="profile-info">Total tasks: ${totalTasks()}</p>
  `
  if (currentUser.isAdmin) {
    profileHTML += `
    <p class="subheading">
    You can add users here:
    </p>
    `
    profileHTML += adminProfileTemplate
    const userList = manageUsers()
    profileHTML += userList.outerHTML
  }
  userProfile.innerHTML = profileHTML
  getProfileButtons()
}

function userLogout() {
  setCookie('')
  location.reload()
  console.log('user logged out')
}

function footerInfo(user) {
  const name = user.login
  const footerFields = document.querySelectorAll('[data-footer]')
  footerFields.forEach(field => {
    switch (field.dataset.footer) {
      case 'active':
        field.innerText = activeTasks
        break
      case 'finished':
        field.innerText = finishedTasks
        break
      case 'uname':
        field.innerText = name[0].toUpperCase() + name.substring(1)
        break
      case 'year':
        const d = new Date()
        field.innerText = d.getFullYear()
        break
    }
  })

  console.log(footerFields, user)
}
function styleArrow() {
  const dropDown = document.querySelector('.dropdown-toggle')

  dropDown.addEventListener('mouseenter', () => {
    dropDown.style.setProperty('--angle', '180deg')
  })
  dropDown.addEventListener('mouseleave', () => {
    dropDown.style.setProperty('--angle', 0)
  })
  // dropDown.addEventListener('click', () => {})
}

function init() {
  const signInField = document.querySelector('#sign-in')
  const footerPars = document.querySelectorAll('footer p')
  signInField.addEventListener('click', styleArrow)
  // console.log(footer)
  const currentUser = getCurrentUser()
  if (currentUser) {
    signInField.innerHTML = userPanel
    document.querySelector('#content').innerHTML = taskFieldTemplate
    populateBoard()
    dragAndDrop()
    userMenu()

    footerInfo(currentUser)
  } else {
    signInField.innerHTML = loginForm
    footerPars.forEach(par => {
      par.innerText = ''
    })
    signIn()
  }
}

init()
