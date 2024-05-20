import { User } from "./user.model"

export interface ChatText {
    user: User
    text: string
    time: Date
    isSeen: boolean
    img?: string
}
//get an obj with user, text, time and possibly img.

