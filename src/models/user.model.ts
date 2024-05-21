export interface User {
    username: string
    email: string
    id: string
    avatar?: string
    lastMsg: string
    blocked?: string[]
}


export type ChatItem = {
    chatId: string
    isSeen: boolean
    receiverId: string
    updatedAt: number
    user: User
}