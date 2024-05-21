import { Input } from '@/components/ui/input'
import { useChatStore } from '@/lib/chatStore'
import { db } from '@/lib/firebase'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import { MsgItem } from './MsgItem'
import { useUserStore } from '@/lib/userStore'
import { QuickAvatar } from './QuickAvatar'
import { ChatText, Message } from '@/models/chat.model'
import { upload } from '@/lib/upload'
// import { AddUser } from './AddUser'

export function Chat() {
    const [chat, setChat] = useState<ChatText|object|any>({})
    const [isEmojiOpen, setIsEmojiOpen] = useState(false)
    const [text, setText] = useState('')
    const [img, setImg] = useState({file: null, url: ''})
    const endRef = useRef<HTMLDivElement>(null)

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore()
    const { currentUser } = useUserStore()

    useEffect(() => {
        if (!endRef.current) return
        endRef.current.scrollIntoView({ behavior: 'smooth' })
        console.log('scrolling to view:', endRef.current.classList.toString())
    }, [endRef.current])


    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'chats', chatId!), async (res: any) => {
            
            setChat(res.data()) 
            
        })
        return () => unSub()
    }, [chatId])

    const handleImg = (e: any) => {
        if (!e.target.files[0]) return
        setImg({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })
    }


    const handleEmoji = (e: { emoji: string }) => {
        setText((prevText) => prevText + e.emoji)
        setIsEmojiOpen(false)
    }

    // const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    const handleSend = async () => {
        if (text === '') return

        let imgUrl: {}|null = null 

        try{

            if(img.file){
                imgUrl = await upload(img.file) as string
            }

            await updateDoc(doc(db, 'chats', chatId!), {
                messages: arrayUnion({
                    senderId: currentUser?.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                })
            })

            const userIds = [currentUser?.id, user!.id]


            userIds.forEach(async (id) => {
                
                const userChatRef = doc(db, 'userChats', id!)
                const userChatsSnapshot = await getDoc(userChatRef)
                
            if(userChatsSnapshot.exists()){
                const userChatsData = userChatsSnapshot.data()
                const chatIndex = userChatsData.chats.findIndex((chat: any) => chat.chatId === chatId)
                
                userChatsData.chats[chatIndex].lastMessage = text
                userChatsData.chats[chatIndex].isSeen = id === currentUser?.id 
                userChatsData.chats[chatIndex].updatedAt = Date.now()

                await updateDoc(userChatRef, {
                    chats: userChatsData.chats
                })
            }
        })
        }catch(err){
            console.error(err)
        }

        setImg({ file: null, url: '' })
        setText('')
    }

    // if(chat.messages === undefined) return <h6>loading  </h6>

    return (
        <div className="chat flex flex-col flex-[2] border-myBorder border-x h-full">
            <div className="top p-5 flex items-center justify-between border-b border-myBorder">
                <div className="user flex gap-4 items-center">
                    <QuickAvatar user={user!} />
                    <div className="texts">
                        <span className="text-lg font-bold tracking-wide">{user?.username}</span>
                        {/* {chat.messages && <p className="text-sm font-thin text-stone-400">{chat.messages[chat.messages.length - 1].text}</p>} */}
                    </div>
                </div>
                <div className="icons flex gap-5">
                    <img className="w-5 h-5 cursor-pointer" src="./phone.png" alt="" />
                    <img className="w-5 h-5 cursor-pointer" src="./video.png" alt="" />
                    <img className="w-5 h-5 cursor-pointer" src="./info.png" alt="" />
                </div>
            </div>
            <div className="center p-3 flex gap-5 flex-col flex-1 border-b border-myWhite overflow-y-auto">
                {/* START OF MSGs */}
                
                {chat.messages &&chat.messages.map((c: Message) => {
                    return <MsgItem 
                            key={c.createdAt.toString()}
                            msg={c} user={c.senderId === currentUser?.id ? currentUser : user!}
                            isMe={c.senderId === currentUser?.id}
                            />
                })}

                {/* END OF MSG */}
                {img.url && <div className="message own">
                    <div className="texts">
                        <img src={img.url} alt="" />
                    </div>
                </div>}
                <div className="end-div" ref={endRef}></div>
            </div>
            <div className="bottom flex items-center justify-between p-5">
                <div className="icons flex gap-5">

                    <label htmlFor="file">
                        <img className="w-5 h-5 cursor-pointer" src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{ display: 'none' }} onChange={handleImg} />

                    <img className="w-5 h-5 cursor-pointer" src="./camera.png" alt="" />
                    <img className="w-5 h-5 cursor-pointer" src="./mic.png" alt="" />
                </div>
                <Input
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                    type="text"
                    placeholder={ isCurrentUserBlocked || isReceiverBlocked ? 'You are blocked' : `Type a message...`}
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    className={`flex-1 mx-3 bg-myBlue border-none outline-none focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-[0] ${isCurrentUserBlocked || isReceiverBlocked ? 'bg-opacity-50 cursor-not-allowed' : ''}`}
                />
                <div className="emoji relative">
                    <img
                        onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                        className="w-5 h-5 cursor-pointer"
                        src="./emoji.png"
                        alt=""
                    />
                    <EmojiPicker
                        open={isEmojiOpen}
                        onEmojiClick={handleEmoji}
                        className="absolute bottom-12 left-0"
                        style={{ position: 'absolute' }}
                        autoFocusSearch={true}
                    />
                </div>
                <button 
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                    onClick={handleSend}
                    className={`send-btn ml-3 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-sm ${isCurrentUserBlocked || isReceiverBlocked ? 'bg-opacity-50 cursor-not-allowed' : ''}`}>
                    Send
                </button>
            </div>
        </div>
    )
}
