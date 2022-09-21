import { getCurrentUser, signUp } from '../BLL/userlogic'
import { styleArrow, userProfile } from './userPLL'
import { getFromStorage, setObject } from '../DAL/utils'

import adminProfileTemplate from './templates/adminProfile.html'
import selectFormTemplate from './templates/selectForm.html'

export function manageUsers() {
  const ul = document.createElement('ul')
  ul.className = 'list__users'
  ul.dataset.users = 'users'

  const users = getFromStorage('users')
  for (const user of users) {
    const li = document.createElement('li')
    li.className = 'userlist_user'

    const btn = document.createElement('a')
    btn.type = 'button'
    btn.className = 'btn-close mx-2 del-user'

    if (user.isAdmin) btn.className += ' disabled'

    btn.ariaLabel = 'Close'
    li.innerText = user.login
    btn.id = user.id
    li.appendChild(btn)
    ul.appendChild(li)
  }
  return ul
}

export function deleteUser() {
  const users = getFromStorage('users')
  const index = users.findIndex(elem => this.id === elem.id)
  users.splice(index, 1)
  setObject('users', users)
  showProfile()
}

export function showProfile() {
  userProfile()
  const userProfileSel = document.querySelector('#user-profile')
  const userList = manageUsers()

  const currentUser = getCurrentUser()
  // if (currentUser.isAdmin && currentUser.login === 'admin')
  if (currentUser.isAdmin) {
    userProfileSel.innerHTML += adminProfileTemplate
    userProfileSel.appendChild(userList)
  }
  getProfileButtons()
}

function getProfileButtons() {
  const delUsers = document.querySelectorAll('.del-user')
  if (delUsers)
    delUsers.forEach(du => {
      du.addEventListener('click', deleteUser)
    })
  signUp()
}

export function assignTask(elemId) {
  const currentUser = getCurrentUser()
  const users = getFromStorage('users')

  if (currentUser.isAdmin) {
    document.querySelector('#task-assignment').innerHTML = selectFormTemplate
    const selectUser = document.querySelector('#select-user')
    users.forEach(user => {
      const option = document.createElement('option')
      option.dataset.userId = user.id
      option.textContent = user.login
      option.value = user.id
      if (user.id === elemId) option.setAttribute('selected', true)
      selectUser.appendChild(option)
    })
  }
}
