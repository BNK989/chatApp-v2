import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/lib/chatStore'
import { db } from '@/lib/firebase'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { MsgItem } from './MsgItem'
import { useUserStore } from '@/lib/userStore'
// import { AddUser } from './AddUser'

export function Chat() {
    const [chat, setChat] = useState({createdAt: Date, messages: []})
    const [isEmojiOpen, setIsEmojiOpen] = useState(false)
    const [text, setText] = useState('')
    const endRef = useRef<HTMLDivElement>(null!)

    const { chatId, user } = useChatStore()
    const { currentUser } = useUserStore()

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [])

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'chats', chatId), async (res: any) => {
            setChat(res.data())
            // console.log('chat:', res.data())
        })
        return () => unSub()
    }, [chatId])

    console.log('chat:', chat)

    const handleEmoji = (e: { emoji: string }) => {
        setText((prevText) => prevText + e.emoji)
        setIsEmojiOpen(false)
    }

    // const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    const handleSend = async () => {
        if (text === '') return
        // console.log('text:', text)
        // console.log('chatId:', chatId)
        try{
            // console.log('currentUser:', currentUser)
            // console.log('user:', user)
            await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                    senderId: currentUser?.id,
                    text,
                    createdAt: new Date(),
                })
            })

            const userIds = [currentUser?.id, user.id]


            userIds.forEach(async (id) => {
                
                const userChatRef = doc(db, 'userChats', id)
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
    }

    return (
        <div className="chat flex flex-col flex-[2] border-myBorder border-x h-full">
            <div className="top p-5 flex items-center justify-between border-b border-myBorder">
                <div className="user flex gap-4 items-center">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="./avatar.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="texts">
                        <span className="text-lg font-bold tracking-wide">Jane Doe</span>
                        <p className="text-sm font-thin text-stone-400">Hey, how are you doing?</p>
                    </div>
                </div>
                <div className="icons flex gap-5">
                    <img className="w-5 h-5 cursor-pointer" src="./phone.png" alt="" />
                    <img className="w-5 h-5 cursor-pointer" src="./video.png" alt="" />
                    <img className="w-5 h-5 cursor-pointer" src="./info.png" alt="" />
                </div>
            </div>
            <div className="center p-3 flex gap-5 flex-col flex-1 border-b border-myWhite overflow-y-scroll">
                {/* START OF MSGs */}
                
                {chat.messages.map((c: any) => {
                    return <MsgItem msg={c} user={c.senderId === currentUser?.id ? currentUser : user} isMe={c.senderId === currentUser?.id}/>
                    // return <p>{c.text}</p>
                })}

                {/* <pre>{JSON.stringify(chat, null, 2)}</pre> */}
               {/* {chat.messages.map((chat: any) =>{return<MsgItem />} */}
                {/* END OF MSG */}
                <div ref={endRef}></div>
            </div>
            <div className="bottom flex items-center justify-between p-5">
                <div className="icons flex gap-5">
                    <img className="w-5 h-5 cursor-pointer" src="./img.png" alt="" />
                    <img className="w-5 h-5 cursor-pointer" src="./camera.png" alt="" />
                    <img className="w-5 h-5 cursor-pointer" src="./mic.png" alt="" />
                </div>
                <Input
                    type="text"
                    placeholder="Type a message..."
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    className="flex-1 mx-3 bg-myBlue border-none outline-none focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-[0]"
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
                    onClick={handleSend}
                    className="send-btn ml-3 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-sm ">
                    Send
                </button>
            </div>
        </div>
    )
}
