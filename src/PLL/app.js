import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/bootstrap.min.css'
import './styles/style.css'
import userPanel from './templates/userPanel.html'
import loginForm from './templates/loginForm.html'
import taskFieldTemplate from './templates/taskField.html'
import { styleArrow, populateBoard, userMenu, footerInfo } from './userPLL'
import { dragAndDrop } from '../BLL/services'
import { signIn, getCurrentUser } from '../BLL/userlogic'

console.clear()

export function init() {
  const signInField = document.querySelector('#sign-in')
  const footerPars = document.querySelectorAll('footer p')
  console.log(signInField)
  signInField.addEventListener('click', styleArrow)

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
