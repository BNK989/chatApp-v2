import { useUserStore } from '@/lib/userStore'
import { QuickAvatar } from './QuickAvatar'
import { User } from '@/models/user.model'

export function MsgItemPreview({user, isSeen, doThis}: {user : User, isSeen: boolean, doThis: () => void}) {
  
  const { currentUser } = useUserStore()
  const isBlocked = user.blocked!.includes(currentUser!.id)
  if(isBlocked) delete user.avatar
  
  return (
    <div onClick={doThis} 
      className={`item flex items-center gap-5 p-3 border-b border-myBorder cursor-pointer ${isSeen ? '' : 'bg-blue-500 font-extrabold'}`}>
    <QuickAvatar user={user!}/>
    <div className="texts">
      <span className='font-bold capitalize'>
        { isBlocked
        ? 'User' 
        : user?.username}
      </span>
      <p className='max-w-52 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis'>{user?.lastMsg}</p>
    </div>
  </div>
  )
}