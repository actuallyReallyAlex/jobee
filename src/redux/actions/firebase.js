import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { setLoadingState } from './app'
import { getRedirectResult } from '../../firebase/auth'

export const SET_DATABASE_CONNECTED = 'SET_DATABASE_CONNECTED'
export const SIGN_IN = 'SIGN_IN'
export const SET_USER = 'SET_USER'
export const SET_HAS_CHECKED_FOR_USER = 'SET_HAS_CHECKED_FOR_USER'

export const setDatabaseConnected = isDatabaseConnected => ({
  type: SET_DATABASE_CONNECTED,
  payload: { isDatabaseConnected }
})

const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore()
    db ? resolve() : reject('Firestore is not connected.')
  })
}

export const checkDatabaseConnection = () => {
  return dispatch => {
    return connectToDatabase()
      .then(() => {
        dispatch(setDatabaseConnected(true))
        dispatch(setLoadingState(false))
      })
      .catch(err => {
        console.log(err)
        dispatch(setDatabaseConnected(false))
      })
  }
}

const setHasCheckedForUser = hasCheckedForUser => ({
  type: SET_HAS_CHECKED_FOR_USER,
  payload: { hasCheckedForUser }
})

const setUser = user => ({ type: SET_USER, payload: { user } })

export const checkUser = () => {
  return dispatch => {
    return getRedirectResult()
      .then(({ additionalUserInfo, credential }) => {
        if (credential) {
          console.log({ additionalUserInfo, credential })
          const { accessToken } = credential
          const { isNewUser, profile } = additionalUserInfo
          const { email, firstName, id, lastName, picture } = profile

          const user = {
            accessToken,
            email,
            firstName,
            id,
            isNewUser,
            lastName,
            picture
          }
          dispatch(setHasCheckedForUser(true))
          dispatch(setUser(user))
        } else {
          dispatch(setHasCheckedForUser(true))
          dispatch(
            setUser({
              accessToken: null,
              email: null,
              firstName: null,
              id: null,
              isNewUser: null,
              lastName: null,
              picture: null
            })
          )
        }
      })
      .catch(err => {
        console.warn(
          'An error has occured when trying to access the redirect result.'
        )
        console.log(err)
        dispatch(setUser(null))
      })
  }
}

const getLocalUserData = () => {
  return new Promise((resolve, reject) => {
    const idb = window.indexedDB
    const dbPromise = idb.open('firebaseLocalStorageDb')

    dbPromise.onsuccess = event => {
      const { result } = event.target
      console.log({ result })
      const numberOfObjectStores = result.objectStoreNames.length
      if (numberOfObjectStores > 0) {
        const transaction = result.transaction(
          'firebaseLocalStorage',
          'readonly'
        )
        const objectStore = transaction.objectStore('firebaseLocalStorage')
        console.log({ objectStore })

        const request = objectStore.get(
          'firebase:authUser:AIzaSyDl4JQtZFD0SMRiGUqHiLZMUGXDjWrU_aM:[DEFAULT]'
        )
        request.onsuccess = event => {
          const {
            displayName,
            email,
            lastLoginAt,
            photoURL
          } = event.target.result.value
          const userData = { displayName, email, lastLoginAt, photoURL }
          console.log({ displayName, email, lastLoginAt, photoURL })
          resolve(userData)
        }
        request.onerror = event => {
          console.warn('An error has occured.')
          console.log({ event })
          reject(event)
        }
      } else {
        reject('No object store.')
      }
    }

    dbPromise.onerror = event => {
      console.warn('An error has occured.')
      console.log({ event })
      reject(event)
    }
  })
}

export const checkIndexedDB = () => {
  return dispatch => {
    return getLocalUserData()
      .then(userData => {
        // * Dispatch an action to set this local user data
        dispatch(setHasCheckedForUser(true))
        dispatch(setUser(userData))
      })
      .catch(err => {
        // ? Dispatch an action to set that there was no local user data
        console.warn(err)
        dispatch(setHasCheckedForUser(true))
        dispatch(
          setUser({
            displayName: null,
            email: null,
            lastLoginAt: null,
            photoURL: null
          })
        )
      })
  }
}

// export const signIn = () => {
//   return dispatch => {
//     return signInWithRedirect()
//       .then(user => {})
//       .catch(err => console.log(err))
//   }
// }
