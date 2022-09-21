import { checkCookie, getCurrentUser } from './userlogic'
import { Task } from '../DAL/Task'
import { getFromStorage, setObject } from '../DAL/utils'
import editForm from '../PLL/templates/editForm.html'
import { init } from '../PLL/app'
import { footerInfo } from '../PLL/userPLL'
import { assignTask } from '../PLL/adminPLL'

export function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData('text/html', ev.target.id)
  ev.dataTransfer.effectAllowed = 'move'
}

export function dragover_handler(ev) {
  if (ev.target.classList.contains('board__block_tasks'))
    ev.target.classList.add('board__block_tasks_hover')

  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'move'
}

export function drop_handler(ev) {
  if (ev.target.classList.contains('board__block_tasks')) {
    ev.target.classList.remove('board__block_tasks_hover')
    const data = ev.dataTransfer.getData('text/html')

    const element = document.getElementById(data)
    element.dataset.stage = ev.target.id

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
    footerInfo(getCurrentUser())
  }
}

export function addTask() {
  const modalForm = document.querySelector('#task-form')

  modalForm.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(modalForm)
    const title = formData.get('title')
    const desc = formData.get('desc')
    createTask(title, desc)
  })
}

function createTask(title, desc) {
  const userId = checkCookie()
  const task = new Task(userId, 'backlog', title, desc)
  Task.save(task)
  init()
}

export function updateTask(elem) {
  const tasks = getFromStorage('tasks')
  const taskForm = document.querySelector('#task-form')
  const formData = new FormData(taskForm)
  const title = formData.get('title')
  const desc = formData.get('desc')
  const userSelect = formData.get('user-select')
  const userTasks = []
  for (let task of tasks) {
    if (task.id === elem.id) {
      task.title = title
      task.description = desc
      task.userId = userSelect
    }
    userTasks.push(task)
  }
  setObject('tasks', userTasks)
}

export function deleteTask(elem) {
  const tasks = getFromStorage('tasks')
  const index = tasks.findIndex(task => task.id === elem.id)
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

  assignTask(elem.dataset.userId)
  boardContent.addEventListener('submit', e => {
    e.preventDefault()
    updateTask(elem)
    location.reload()
  })
  boardContent.addEventListener('reset', e => {
    deleteTask(elem)
    location.reload()
  })
  boardContent.addEventListener('click', e => {
    if (e.target.dataset.crud === 'cancel') location.reload()
  })
}
