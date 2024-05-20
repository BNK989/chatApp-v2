import { useState, useRef, useEffect } from 'react'
import { MsgItemPreview } from './MsgItemPreview'
import { AddUser } from './AddUser'
import { useUserStore } from '@/lib/userStore'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { User, ChatItem } from '@/models/user.model'
import { useChatStore } from '@/lib/chatStore'

function ChatList() {
    const [addMode, setAddMode] = useState(false)
    const [chats, setChats] = useState<ChatItem[]>([])
    const [isScrolling, setIsScrolling] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const { currentUser } = useUserStore()
    const { changeChat } = useChatStore()

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
            console.log('sortedChatData:', sortedChatData)
        })
        return () => unSub()
    }, [currentUser?.id])

    const handleScroll = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsScrolling(true)
        timeoutRef.current = setTimeout(() => setIsScrolling(false), 999)
    }

    const handleSelect = async (chat: any) => {
        console.log('handleSelect:', chat)
        changeChat(chat.chatId, chat.user)
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
                    <img
                        className="w-5 h-5 p-3 mx-2 rounded-md cursor-pointer bg-myBlue"
                        onClick={() => setAddMode(!addMode)}
                        src={addMode ? './minus.png' : './plus.png'}
                        alt="plus"
                    />
                </div>

                {chats.map((chat) => (
                    <MsgItemPreview key={chat.id} user={chat.user} doThis={()=> handleSelect(chat)}/>
                ))}
            </div>
            {addMode && <AddUser />}
        </>
    )
}

export default ChatList
