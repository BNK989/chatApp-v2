import { create } from 'zustand'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import { User } from '@/models/user.model'

type UserStore = {
    currentUser: User | null,
    isLoading: boolean,
    fetchUserInfo: (uid: string) => Promise<void>,
}


export const useUserStore = create((set: (arg: Partial<UserStore>) => void) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid: string |null) => {
    // console.log('uid:', uid)

    if(!uid){
        console.log('No uid:')
        return set({currentUser: null, isLoading: false})
    } 

        try {
            const docRef = doc(db, 'users', uid)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                return set({currentUser: docSnap.data() as User, isLoading: false})
            } else {
                return set({currentUser: null, isLoading: false})
            }
        } catch (error) {
            console.error(error)
            return set({currentUser: null, isLoading: false})
        }
  }
}))



