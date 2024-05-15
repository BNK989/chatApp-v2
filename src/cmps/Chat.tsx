import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect } from 'react'
import { AddUser } from './AddUser'

function Chat() {
    const [isEmojiOpen, setIsEmojiOpen] = React.useState(false)
    const [text, setText] = React.useState('')
    const endRef = React.useRef<HTMLDivElement>(null!)

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [])

    const handleEmoji = (e: {emoji: string}) => {
        setText((prevText) => prevText + e.emoji)
        setIsEmojiOpen(false)
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
                <div className="message max-w-[80%] flex gap-5 ">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="./avatar.png" />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <div className="texts  flex flex-col">
                        <img
                            className="max-w-[70%] max-h-[70%] object-cover rounded my-1"
                            src="https://picsum.photos/200/300"
                            alt=""
                        />
                        <p className="p-3 rounded bg-cyan-950 bg-opacity-30">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veritatis expedita
                            debitis inventore perspiciatis in unde qui?
                        </p>
                        <span className="text-xs mt-1">1 min ago</span>
                    </div>
                </div>

                <div className="message max-w-[80%] flex gap-5 self-end flex-row-reverse">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="./avatar.png" />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <div className="texts p-3 rounded bg-sky-500 bg-opacity-30">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veritatis expedita
                            debitis inventore perspiciatis in unde qui?
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="./avatar.png" />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <div className="texts">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veritatis expedita
                            debitis inventore perspiciatis in unde qui?
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="./avatar.png" />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <div className="texts">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veritatis expedita
                            debitis inventore perspiciatis in unde qui?
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="./avatar.png" />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <div className="texts">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veritatis expedita
                            debitis inventore perspiciatis in unde qui?
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="./avatar.png" />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <div className="texts">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veritatis expedita
                            debitis inventore perspiciatis in unde qui?
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="./avatar.png" />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <div className="texts">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veritatis expedita
                            debitis inventore perspiciatis in unde qui?
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="./avatar.png" />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <div className="texts">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veritatis expedita
                            debitis inventore perspiciatis in unde qui?
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="./avatar.png" />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <div className="texts">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veritatis expedita
                            debitis inventore perspiciatis in unde qui?
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
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
                <button className="send-btn ml-3 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-sm ">
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chat
