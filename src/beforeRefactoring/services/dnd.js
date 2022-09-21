import {
  dragstart_handler,
  dragover_handler,
  drop_handler,
  addTask,
  editTask,
} from '../utils'
import modalForm from '../templates/modalForm.html'

export const dragAndDrop = () => {
  const blocks = document.querySelectorAll('.board__block_tasks')
  const cards = document.querySelectorAll('.block__card')

  const addCardButtons = document.querySelectorAll('.button__add-card')

  addCardButtons.forEach(btn => {
    btn.addEventListener('mouseover', () => {
      document.querySelector('#modal').innerHTML = modalForm
    })
    btn.addEventListener('click', () => {
      addTask()
    })
  })

  cards.forEach(card => {
    // console.log(card)
    card.addEventListener('dragstart', e => dragstart_handler(e))
    card.addEventListener('dblclick', e => {
      editTask(e.originalTarget.parentElement)
      // console.log(e.originalTarget.parentElement)
    })
  })
  blocks.forEach(block => {
    block.addEventListener('drop', e => drop_handler(e))
    block.addEventListener('dragover', e => dragover_handler(e))
  })
}
