import { useState, useRef } from "react"
import { MsgItem } from "./MsgItem"

function ChatList() {
  const [addMode, setAddMode] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScroll = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsScrolling(true)
    timeoutRef.current = setTimeout(() => setIsScrolling(false), 999)
  }

  return (
    <div
      className={`relative chatList flex-1 overflow-y-auto ${isScrolling ? "scrolling" : ""}`}
      onScroll={handleScroll}
    >
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
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="plus"
        />
      </div>
      <MsgItem/>
      <MsgItem/>
      <MsgItem/>
      <MsgItem/>
      <MsgItem/>
      <MsgItem/>
      <MsgItem/>
      <MsgItem/>
      <MsgItem/>
      <MsgItem/>
      <MsgItem/>
    </div>
  )
}

export default ChatList
