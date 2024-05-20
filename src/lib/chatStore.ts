import { create } from 'zustand'
import { User } from '@/models/user.model'
import { useUserStore } from './userStore'
// import { doc, getDoc } from 'firebase/firestore'
// import { db } from './firebase'
// import { AnyCnameRecord } from 'dns'

type ChatStore = {
    chatId: string | null
    user: User | null
    isCurrentUserBlocked: boolean
    isReceiverBlocked: boolean
    // fetchUserInfo: (uid: string) => Promise<void>,
}

// export const useChatStore = create((set: (arg: Partial<ChatStore>) => void) => ({
export const useChatStore = create((set: (arg: any) => void) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    changeChat: (chatId: string | null, user: User | null) => {
        const currentUser = useUserStore.getState().currentUser

        //CHECK IF BLOCKED
        if (user && user.blocked!.includes(currentUser!.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            })
        }

        else if (currentUser && currentUser.blocked!.includes(user!.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,
            })
        }
        else{
            return set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: false,
            })
        }
    },
    changeBlock: () => {
        set((state: any) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }))
    },
}))
