import { User } from '@/models/user.model'
import { QuickAvatar } from './QuickAvatar'

export function MsgItem({ msg, user, isMe }: { msg: any; user: User; isMe: boolean }) {
    const createdAt = msg.createdAt.toDate().toLocaleTimeString()
    return (
        <div className={`message  flex gap-5 ${isMe ? 'flex-row-reverse' : ''}`}>
            <QuickAvatar user={user} className="w-8 h-8" />
            <div className={`texts flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {msg.img && (
                    <img className="w-2/4 object-cover rounded my-1 " src={msg.img} alt={user.username + 's image'} />
                )}
                <p className=" p-3 rounded bg-cyan-950 bg-opacity-30">{msg.text}</p>
                <span className="text-xs mt-1">{createdAt}</span>
            </div>
        </div>
    )
}
