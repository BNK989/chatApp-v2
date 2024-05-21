import { MenuOption } from './MenuOption'
import { auth, db } from '@/lib/firebase'
import { useChatStore } from '@/lib/chatStore'
import { useUserStore } from '@/lib/userStore'
import { QuickAvatar } from './QuickAvatar'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
export function Detail() {
    const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore()
    const { currentUser } = useUserStore()

    const handleBlock = async (): Promise<void> => {
      if (!user) return

        const userDocRef = doc(db, 'users', currentUser!.id)
        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user!.id) : arrayUnion(user!.id),
            })
            changeBlock()
        } catch (err) {
            console.error('an error while blocking:', err)
        }
    }

    return (
        <div className="detail flex-1 m-2 relative">
            <div className="user py-5 px-5 flex flex-col items-center gap-5 border-b border-myBorder ">
                <QuickAvatar user={user!} />
                <h2>{user?.username}</h2>
                <p>Online</p>
            </div>
            <div className="info p-5 flex flex-col gap-7 overflow-y-hidden">
                <MenuOption title="Chat Settings" />
                <MenuOption title="Privacy" />
                <MenuOption title="Shared Photos" />
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
                <div className="absolute bottom-4 left-0 flex justify-evenly w-full">
                    <button
                        onClick={handleBlock}
                        className="py-3 px-5 bg-red-700 bg-opacity-50 text-white rounded-s hover:bg-opacity-75 transition-colors">
                        { isCurrentUserBlocked ? 'You are Blocked' : isReceiverBlocked ? 'Unblock' : 'Block' }
                    </button>
                    <button
                        onClick={() => {
                            auth.signOut()
                        }}
                        className="py-2 px-3 bg-blue-500 bg-opacity-50 text-white rounded-s hover:bg-opacity-75 transition-colors">
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    )
}
