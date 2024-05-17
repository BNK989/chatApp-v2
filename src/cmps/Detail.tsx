import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MenuOption } from './MenuOption'
import { auth } from '@/lib/firebase'
export function Detail() {
  return (
    <div className="detail flex-1 m-2 relative">
      <div className="user py-5 px-5 flex flex-col items-center gap-5 border-b border-myBorder ">
        <Avatar className="w-14 h-14">
          <AvatarImage src="./avatar.png" />
          {/* <AvatarFallback>CN</AvatarFallback> */}
        </Avatar>
        <h2>John Doe</h2>
        <p>Online</p>
      </div>
      <div className="info p-5 flex flex-col gap-7 overflow-y-hidden">
        <MenuOption title='Chat Settings'/>
        <MenuOption title='Privacy'/>
        <MenuOption title='Shared Photos'/>
        {/* <MenuOption title='Chat Settings'/> */}
        {/* <div className="option ">
          <div className="title flex items-center justify-between cursor-pointer">
            <span>Chat Settings</span>
            <img className="w-3 h-3 bg-myBlue p-3 rounded-full" src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option ">
          <div className="title flex items-center justify-between cursor-pointer">
            <span>Privacy</span>
            <img className="w-3 h-3 bg-myBlue p-3 rounded-full" src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option ">
          <div className="title flex items-center justify-between cursor-pointer">
            <span>Shared Photos</span>
            <img className="w-3 h-3 bg-myBlue p-3 rounded-full" src="./arrowUp.png" alt="" />
          </div>
        </div> */}



        {/* <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
            <div className="photos">
              <div className="photoItem">
                <img src="./photo.png" alt="" />
                <span>photo_2024_02.png</span>
              </div>
              <img src="./download.png" alt="" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div> */}
        <div className='absolute bottom-4 left-0 flex justify-evenly w-full'>
        <button className="py-3 px-5 bg-red-700 bg-opacity-50 text-white rounded-s hover:bg-opacity-75 transition-colors">Block User</button>
        <button 
          onClick={() => {auth.signOut()}} 
          className="py-2 px-3 bg-blue-500 bg-opacity-50 text-white rounded-s hover:bg-opacity-75 transition-colors">Log Out</button>
        </div>
      </div>
    </div>
  )
}