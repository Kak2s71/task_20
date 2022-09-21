import { BaseModel } from './BaseModel'
import { addToStorage } from './utils'

export class Task extends BaseModel {
  constructor(userId, stage, title, description) {
    super()
    this.userId = userId
    this.stage = stage
    this.title = title
    this.description = description
    this.storageKey = 'tasks'
  }

  static save(task) {
    try {
      addToStorage(task.storageKey, task)
      return true
    } catch (e) {
      throw new Error(e)
    }
  }
}
