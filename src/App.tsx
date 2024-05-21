import { useEffect } from 'react'
import { Chat } from './cmps/Chat'
import { Detail } from './cmps/Detail'
import { List } from './cmps/List'
import { Login } from './cmps/Login'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useUserStore } from './lib/userStore'
import { RotatingLines } from 'react-loader-spinner'
import { useChatStore } from './lib/chatStore'
function App() {
    const { currentUser, isLoading, fetchUserInfo } = useUserStore()
    const { chatId } = useChatStore()

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user: any) => {
            fetchUserInfo(user?.uid)
        })

        return () => {
            unSub()
        }
    }, [fetchUserInfo])

    if (isLoading)
        return (
            <div className="w-full h-full flex items-center justify-center">
                <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="96" visible={true} />
            </div>
        )

    return (
        <div className="backdrop-blur-lg bg-myBlue rounded-xl backdrop-saturate-150 border border-myWhite flex w-full h-screen md:w-[80vw] md:h-[90dvh]">
            {currentUser ? (
                <>
                    <List />
                    {chatId && <Chat></Chat>}
                    {chatId && <Detail></Detail>}
                    {!chatId && <div className='flex-[3] h-full border-myBorder border-x flex justify-center items-center'>
                                    <h4 className='text-white text-opacity-65'>Select a chat to start chatting</h4>
                                </div>}
                </>
            ) : (
                <Login></Login>
            )}
        </div>
    )
}

export default App

