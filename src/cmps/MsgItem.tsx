import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


export function MsgItem(){
  return (
    <div className="item flex items-center gap-5 p-3 border-b border-myBorder cursor-pointer">
    <Avatar className="w-12 h-12">
      <AvatarImage src="./avatar.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <div className="texts">
      <span className='font-bold'>Jane Doe1</span>
      <p className='max-w-52 text-sm font-thin whitespace-nowrap overflow-hidden text-ellipsis'>Hey, how are you doing? sfdsdf sdf sdf dsf dsfsdfsd sdfdf sf sdfs df sdfsdfs</p>
    </div>
  </div>
  )
}

export default MsgItem