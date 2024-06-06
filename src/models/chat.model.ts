// import { firestore } from 'firebase';

export interface ChatText {
    createdAt: Date
    messages: Message[]
    isSeen: boolean
    img?: string
}

export type Message = {
    senderId: string
    text: string
    createdAt: Date | string
    img?: string
}
//get an obj with user, text, time and possibly img.

