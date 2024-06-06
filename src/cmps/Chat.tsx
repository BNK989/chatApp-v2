/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { db } from '@/lib/firebase'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import { MsgItem } from './MsgItem'
import { QuickAvatar } from './QuickAvatar'
import { ChatText, Message } from '@/models/chat.model'
import { upload } from '@/lib/upload'

import { useChatStore } from '@/lib/chatStore'
import { useUserStore } from '@/lib/userStore'
import { useAppStore } from '@/lib/appStore'
// import { AddUser } from './AddUser'

type ImgState = {
    file: File | null;
    url: string;
}

export function Chat() {
    const [chat, setChat] = useState<ChatText>()
    const [isEmojiOpen, setIsEmojiOpen] = useState(false)
    const [text, setText] = useState('')
    const [img, setImg] = useState<ImgState>({file: null, url: ''})
    const endRef = useRef<HTMLDivElement>(null)

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore()
    const { currentUser } = useUserStore()
    const { setCurrentScreenIndex } = useAppStore()

    // useEffect(() => {
    //     if (!endRef.current) return
    //     endRef.current.scrollIntoView({ behavior: 'smooth' })
    // }, [chat.length])

    // }, [endRef.current])
    
    
    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'chats', chatId!), async (res: any) => {
            
            await setChat(res.data()) 
            if (endRef.current){
                setTimeout(() => endRef.current!.scrollIntoView({ behavior: 'smooth' }), 1)

            } 
            
        })
        return () => unSub()
    }, [chatId])

    const handleImg = (e: React.ChangeEvent<HTMLInputElement>)=> {
        if(!e.target.files || !e.target.files![0]) return
        setImg({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })
    }


    const handleEmoji = (e: { emoji: string }) => {
        setText((prevText) => prevText + e.emoji)
        setIsEmojiOpen(false)
    }

    // const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (text === '') return

        let imgUrl: string | null = null 

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
                    <button onClick={()=>{setCurrentScreenIndex(0)}}>
                        <img className='w-5 rotate-90' src="./arrowDown.png" alt="back" />
                    </button>
                    <QuickAvatar user={user!} />
                    <div className="texts">
                        <span className="text-lg font-bold tracking-wide capitalize">{user?.username}</span>
                        {/* {chat.messages && <p className="text-sm font-thin text-stone-400">{chat.messages[chat.messages.length - 1].text}</p>} */}
                    </div>
                </div>
                <div className="icons flex gap-5">
                    {/* <img className="w-5 h-5 cursor-pointer" src="./phone.png" alt="" />
                    <img className="w-5 h-5 cursor-pointer" src="./video.png" alt="" /> */}
                    <button onClick={()=>{setCurrentScreenIndex(2)}}>
                        <img className="w-5 h-5 cursor-pointer" src="./info.png" alt="" />
                    </button>
                </div>
            </div>
            <div className="center p-3 flex gap-5 flex-col flex-1 border-b border-myWhite overflow-y-auto">
                {/* START OF MSGs */}
                
                {chat?.messages && chat?.messages.map((c: Message) => {
                    return <MsgItem 
                            key={c.createdAt.toString()}
                            msg={c} user={c.senderId === currentUser?.id ? currentUser : user!}
                            isMe={c.senderId === currentUser?.id}
                            />
                })}
                {/* TODO: first load last 10 msgs or all unread msgs*/}

                {/* END OF MSG */}
                {img.url && <div className="message own">
                    <div className="texts">
                        <img src={img.url} alt="" />
                    </div>
                </div>}
                <div className="end-div" ref={endRef}>...</div>
            </div>
            <div className="bottom flex items-center justify-between p-5">
                <div className="icons flex gap-5">

                    <label htmlFor="file">
                        <img className="w-5 h-5 cursor-pointer" src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{ display: 'none' }} onChange={handleImg} />

                    {/* <img className="w-5 h-5 cursor-pointer" src="./camera.png" alt="" />
                    <img className="w-5 h-5 cursor-pointer" src="./mic.png" alt="" /> */}
                </div>
                <form onSubmit={handleSend} className='w-full flex items-center'>
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
                            className="bottom-16 left-6 md:left-auto "
                            style={{ position: 'fixed' }}
                            lazyLoadEmojis={true}
                            autoFocusSearch={true}
                            theme={"auto" as Theme}
                            width={300}
                            />
                    </div>
                    <button 
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                        className={`send-btn ml-3 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-sm ${isCurrentUserBlocked || isReceiverBlocked ? 'bg-opacity-50 cursor-not-allowed' : ''}`}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    )
}
