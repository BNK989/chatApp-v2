import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: 'reactchat-f979c.firebaseapp.com',
    projectId: 'reactchat-f979c',
    storageBucket: 'reactchat-f979c.appspot.com',
    messagingSenderId: '175566795940',
    appId: '1:175566795940:web:478348c7cf598165056231',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)


export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()

export const gProvider = new GoogleAuthProvider()//.addScope('https://www.googleapis.com/auth/profileinfo.readonly')