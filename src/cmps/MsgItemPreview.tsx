import { QuickAvatar } from './QuickAvatar'
import { User } from '@/models/user.model'

export function MsgItemPreview({user, doThis}: {user : User, doThis: () => void}) {
  return (
    <div onClick={doThis} className="item flex items-center gap-5 p-3 border-b border-myBorder cursor-pointer">
    <QuickAvatar user={user!}/>
    <div className="texts">
      <span className='font-bold'>{user?.username}</span>
      <p className='max-w-52 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis'>{user?.lastMsg}</p>
    </div>
  </div>
  )
}