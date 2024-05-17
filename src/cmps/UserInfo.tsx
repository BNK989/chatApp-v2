import { useUserStore } from "@/lib/userStore"
import { QuickAvatar } from "./QuickAvatar"


export function UserInfo() {

  const { currentUser } = useUserStore()

  return (
    <div className="userInfo p-5 flex items-center justify-between">
      <div className="user flex items-center gap-5">
        <QuickAvatar user={currentUser!}/>
        <h2>{currentUser!.username}</h2>
      </div>
      <div className="icons flex gap-5">
        <img className="w-5 cursor-pointer" src="./more.png" alt="more" />
        <img className="w-5 cursor-pointer" src="./video.png" alt="video" />
        <img className="w-5 cursor-pointer" src="./edit.png" alt="edit" />
      </div>
    </div>
  )
}

export default UserInfo
