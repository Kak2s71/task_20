import { getFromStorage } from '../DAL/utils'
import { getCurrentUser, checkCookie, manageUser } from '../BLL/userlogic'
import userProfileTemplate from './templates/userProfile.html'
let activeTasks = 0
let finishedTasks = 0

export function totalTasks() {
  return parseInt(activeTasks) + parseInt(finishedTasks)
}

export function userMenu() {
  const userLinks = document.querySelectorAll('[data-user]')

  userLinks.forEach(link => {
    link.addEventListener('click', () => manageUser(link))
  })
}

export function footerInfo(user) {
  countTasks()
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
  chaseArrow()
}

export function chaseArrow() {
  document.addEventListener('click', styleArrow)
}

export function styleArrow() {
  const dropDown = document.querySelector('.dropdown-toggle')
  if (dropDown.classList.contains('show'))
    dropDown.style.setProperty('--angle', '180deg')
  else dropDown.style.setProperty('--angle', '0deg')
}

export function populateBoard() {
  const userTasks = {
    backlog: [],
    ready: [],
    progress: [],
    finished: [],
  }
  const tasks = getFromStorage('tasks')

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
    taskDiv.dataset.userId = task.userId
    taskDiv.id = task.id
    taskDiv.appendChild(taskTitle)
    taskDiv.appendChild(taskDesc)

    const currentUser = getCurrentUser()
    if (currentUser.isAdmin) {
      userTasks[task.stage].push(taskDiv)
    } else if (task.userId === checkCookie()) {
      userTasks[task.stage].push(taskDiv)
    }
  }

  const boardBlocks = document.querySelectorAll('.board__block_tasks')

  for (let boardBlock of boardBlocks) {
    userTasks[boardBlock.id].forEach(item => {
      boardBlock.appendChild(item)
    })
  }
}

function setTasksCount(task) {
  task.stage === 'finished' ? finishedTasks++ : activeTasks++
}

export function countTasks() {
  const tasks = getFromStorage('tasks')
  const currentUser = getCurrentUser()
  activeTasks = 0
  finishedTasks = 0
  tasks.forEach(task => {
    if (currentUser.isAdmin) setTasksCount(task)
    else if (task.userId === checkCookie()) setTasksCount(task)
  })
}

export function userProfile() {
  document.querySelector('#content').innerHTML = userProfileTemplate
  const userProfile = document.querySelector('#user-profile')

  const currentUser = getCurrentUser()
  let profileHTML = `
  <h3 class="profile-heading">Welcome, ${currentUser.login}</h3>
  <p class="profile-info">Total tasks: ${totalTasks()}</p>
  `
  userProfile.innerHTML = profileHTML
}
