import { useState, useRef, useEffect } from 'react'
import { MsgItemPreview } from './MsgItemPreview'
import { AddUser } from './AddUser'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { User, ChatItem } from '@/models/user.model'

import { useUserStore } from '@/lib/userStore'
import { useChatStore } from '@/lib/chatStore'
import { useAppStore } from '@/lib/appStore'

export function ChatList() {
    const [addMode, setAddMode] = useState(false)
    const [chats, setChats] = useState<ChatItem[]>([])
    const [isScrolling, setIsScrolling] = useState(false)
    const [activeChatId, setActiveChatId] = useState('')
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const { changeChat } = useChatStore()
    const { currentUser } = useUserStore()
    const { setCurrentScreenIndex } = useAppStore()

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'userChats', currentUser!.id), async (res) => {
            const items = res.data()!.chats as ChatItem[]
            const promises: Promise<ChatItem>[] = items.map(async (item) => {
                const userDocRef = doc(db, 'users', item.receiverId)
                const userDocSnap = await getDoc(userDocRef)

                const user = userDocSnap.data() as User

                return { ...item, user }
            })

            const chatData = await Promise.all(promises)
            const sortedChatData: ChatItem[] = chatData.sort((a, b) => b.updatedAt - a.updatedAt)

            setChats(sortedChatData)
            // console.log('sortedChatData:', sortedChatData)
        })
        return () => unSub()
    }, [currentUser?.id])

    const handleScroll = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsScrolling(true)
        timeoutRef.current = setTimeout(() => setIsScrolling(false), 999)
    }

    const handleSelect = async (chat: ChatItem) => {
        const userChats = chats.map((c) => {
            const { user, ...rest } = c
            return rest
        }) //return a smaller obj w/o the user

        setActiveChatId(chat.chatId)

        const chatIndex = userChats.findIndex((c) => c.chatId === chat.chatId)

        userChats[chatIndex].isSeen = true

        const userChatsRef = doc(db, 'userChats', currentUser!.id)

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            })
            changeChat(chat.chatId, chat.user)
            setCurrentScreenIndex(1)
        } catch (err) {
            console.error('error while updating userChats:', err)
        }
    }

    return (
        <>
            <div
                className={`relative chatList flex-1 overflow-y-auto ${isScrolling ? 'scrolling' : ''}`}
                onScroll={handleScroll}>
                <div className="search flex items-center justify-between gap-5 p-5">
                    <div className="search-bar p-3 flex gap-5 rounded-lg bg-myBlue">
                        <img className="w-5 h-5" src="/search.png" alt="" />
                        <input
                            className="bg-transparent border-none outline-none text-white"
                            type="text"
                            placeholder="Search"
                        />
                    </div>
                    <Plus isOpen={addMode} setIsOpen={setAddMode}/>
                    {/* <img
                        className="w-5 h-5 p-3 mx-2 rounded-md cursor-pointer bg-myBlue"
                        onClick={() => setAddMode(!addMode)}
                        src={addMode ? './minus.png' : './plus.png'}
                        alt="plus"
                    /> */}
                </div>

                {chats.map((chat) => (
                    <MsgItemPreview
                        key={chat.chatId}
                        isActive={activeChatId === chat.chatId}
                        chat={chat}
                        doThis={() => handleSelect(chat)}
                    />
                ))}
            </div>
            {addMode && <AddUser closeSelf={() => setAddMode(false)} />}
        </>
    )
}


interface PlusProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }
function Plus({isOpen, setIsOpen} : PlusProps) {
    return (
        <div onClick={() => setIsOpen(!isOpen)} className="relative w-5 h-5 p-3 mx-2 rounded-md cursor-pointer bg-myBlue flex items-center justify-center">
            <span className="absolute w-6 h-[2px] rounded bg-white"></span>
            <span className={`absolute w-6 h-[2px] rounded bg-white transition ${isOpen ? 'open' : 'transform rotate-90'}`}></span>
        </div>
    )
}
