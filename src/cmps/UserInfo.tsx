import { useUserStore } from "@/lib/userStore"
import { QuickAvatar } from "./QuickAvatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"



export function UserInfo() {

  const { currentUser } = useUserStore()

  return (
    <div className="userInfo p-5 flex items-center justify-between">
      <div className="user flex items-center gap-5">
        <QuickAvatar user={currentUser!}/>
        <h2 className="capitalize">{currentUser!.username}</h2>
      </div>
      <div className="icons flex gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger>
          <img className="w-5 cursor-pointer" src="./more.png" alt="more" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>
            <Button onClick={() => auth.signOut()}>Log out</Button>
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <img className="w-5 cursor-pointer" src="./video.png" alt="video" />
        <img className="w-5 cursor-pointer" src="./edit.png" alt="edit" /> */}
      </div>
    </div>
  )
}

export default UserInfo


