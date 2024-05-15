import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"


function UserInfo() {
  return (
    <div className="userInfo p-5 flex items-center justify-between">
      <div className="user flex items-center gap-5">
        <Avatar className="w-12 h-12">
          <AvatarImage src="./avatar.png" />
          {/* <AvatarFallback>CN</AvatarFallback> */}
        </Avatar>
        <h2>John Doe</h2>
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
