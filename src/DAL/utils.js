import { User } from '../DAL/User'
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
