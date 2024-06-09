// import { User } from '@/models/user.model'
// import { Message } from '@/models/chat.model'
import { QuickAvatar } from './QuickAvatar'
import { isRTL } from '@/lib/utils'
export function MsgItem({ msg, user, isMe }){//: { msg: Message; user: User; isMe: boolean }) {


    const timeStamp = (msg.createdAt.seconds * 1000) + (msg.createdAt.nanoseconds / 1000000)

    // const createdAt: string = new Date(msg.createdAt).toLocaleTimeString()
    const createdAt = new Date(timeStamp).toLocaleTimeString()
    console.log('isMe:', isMe)

    const isRtl = isRTL(msg.text)


    return (
        <div className={`message  flex gap-5 ${isMe ? 'flex-row-reverse' : ''}`}>
            <QuickAvatar user={user} className="w-8 h-8" />
            <div className={`texts flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {msg.img && (
                    <img className="w-2/4 object-cover rounded my-1 " src={msg.img} alt={user.username + 's image'} />
                )}
                <p dir={`${isRtl ? 'rtl' : 'ltr'}`} className=" p-3 rounded bg-cyan-950 bg-opacity-30">{msg.text}</p>
                <span className="text-xs mt-1">{createdAt|| 'noDate'}</span>
            </div>
        </div>
    )
}


