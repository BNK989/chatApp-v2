
import { User } from '@/models/user.model'
import { QuickAvatar } from './QuickAvatar'

//get an obj with user, text, time and possibly img.

export function MsgItem({msg, user, isMe}: {msg : any, user: User, isMe: boolean}) {

  const createdAt = msg.createdAt.toDate().toLocaleTimeString()
  return (
    <div className={`message  flex gap-5 ${isMe ? 'flex-row-reverse' : ''}`}>
    <QuickAvatar user={user} className='w-8 h-8'/>
    <div className="texts flex flex-col">
        {msg.img && <img
            className={`max-w-[70%] max-h-[70%] object-cover rounded my-1 ${isMe ? 'self-end' : 'self-start'}`}
            src={msg.img}
            alt=""
        />}
        <p className="p-3 rounded bg-cyan-950 bg-opacity-30">
            {msg.text}
        </p>
        <span className="text-xs mt-1">{createdAt}</span>
    </div>
</div>
  )
}