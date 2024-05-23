import { useUserStore } from '@/lib/userStore'
import { QuickAvatar } from './QuickAvatar'
import { User } from '@/models/user.model'

export function MsgItemPreview({isActive, chat, doThis}: {isActive: boolean, chat: any, doThis: () => void}) {
  const { user } : {user: User} = chat
  
  const { currentUser } = useUserStore()
  const isBlocked = user.blocked!.includes(currentUser!.id)
  if(isBlocked) delete user.avatar
  
  return (
    <div onClick={doThis} 
      className={`item flex items-center gap-5 p-3 border-b border-myBorder cursor-pointer ${isActive ? 'bg-blue-300 bg-opacity-10' : ''}`}>
      <QuickAvatar user={user!}/>
      <div className="texts">
      <span className='font-bold capitalize'>
        { isBlocked
        ? 'User' 
        : user?.username}
      </span>
      <p className='max-w-52 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis'>{chat?.lastMessage}</p>
    </div>
      {(!chat.isSeen && chat.lastMessage) && <p className='text-sm ms-auto py-1 px-3 bg-blue-600 rounded-full'>unread</p>}
  </div>
  )
}