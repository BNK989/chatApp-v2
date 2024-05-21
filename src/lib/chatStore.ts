import { create } from 'zustand'
import { User } from '@/models/user.model'
import { useUserStore } from './userStore'


type ChatStore = {
    chatId: string | null
    user: User | null
    isCurrentUserBlocked: boolean
    isReceiverBlocked: boolean
    changeChat: Function
    changeBlock: Function
}

export const useChatStore = create<ChatStore>((set) => ({
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
                user,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            })
        }

        else if (currentUser && currentUser.blocked!.includes(user!.id)) {
            return set({
                chatId,
                user,
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
    changeBlock: () =>  {
        set((prevState) => ({ ...prevState, isReceiverBlocked: !prevState.isReceiverBlocked }))
    },
}))