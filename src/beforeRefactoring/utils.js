import { Task } from './models/Task'
import editForm from './templates/editForm.html'

export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || '[]')
}

export const addToStorage = function (key, obj) {
  const storageData = getFromStorage(key)
  storageData.push(obj)
  localStorage.setItem(key, JSON.stringify(storageData))
}

export function setObject(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj))
}

export const generateTestUser = function (User) {
  localStorage.clear()
  const testUser = new User('test', 'qwerty123')
  User.save(testUser)
}

export function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  console.log(ev)
  // console.log(this.innerHTML)
  // ev.target.id = ev.id
  ev.dataTransfer.setData('text/html', ev.target.id)
  ev.dataTransfer.effectAllowed = 'move'
}

export function dragover_handler(ev) {
  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'move'
}

export function drop_handler(ev) {
  const data = ev.dataTransfer.getData('text/html')
  console.log(ev.target, data)
  const element = document.getElementById(data)
  element.dataset.stage = ev.target.id
  console.log(element.id)
  ev.target.appendChild(document.getElementById(data))
  const tasks = getFromStorage('tasks')
  const newTasks = []
  for (let task of tasks) {
    if (task.id === element.id) {
      task.stage = element.dataset.stage
    }
    newTasks.push(task)
  }
  setObject('tasks', newTasks)
}

export function addTask() {
  const modalForm = document.querySelector('#task-form')
  // const saveTask = document.querySelector('#save-task')

  modalForm.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(modalForm)
    const title = formData.get('title')
    const desc = formData.get('desc')
    // console.log(title, desc)
    createTask(title, desc)
  })
}

function createTask(title, desc) {
  const userId = checkCookie()
  const task = new Task(userId, 'backlog', title, desc)
  Task.save(task)
  // console.log(userId)
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

export function updateTask(elem) {
  const tasks = getFromStorage('tasks')
  const taskForm = document.querySelector('#task-form')
  const formData = new FormData(taskForm)
  const title = formData.get('title')
  const desc = formData.get('desc')
  // const newTasks = []
  for (let task of tasks) {
    if (task.id === elem.id) {
      task.title = title
      task.description = desc
      addToStorage('tasks', newTasks)
    }
    // newTasks.push(task)
  }
}

export function deleteTask(elem) {
  const tasks = getFromStorage('tasks')
  const index = tasks.findIndex(task => task.id === elem.id)
  console.log(index)
  tasks.splice(index, 1)
  setObject('tasks', tasks)
}

export function editTask(elem) {
  const boardContent = document.querySelector('#content')
  boardContent.innerHTML = editForm
  const taskTitle = document.querySelector('#task-title')
  const taskDesc = document.querySelector('#task-desc')
  taskTitle.value = elem.firstChild.textContent
  taskDesc.value = elem.lastChild.textContent
  // console.log(taskTitle.value, taskDesc.value, elem)
  boardContent.addEventListener('submit', e => {
    e.preventDefault()
    updateTask(elem)
    location.reload()
  })
  boardContent.addEventListener('reset', e => {
    // e.preventDefault()
    console.log(e)
    deleteTask(elem)
    location.reload()
  })
}
