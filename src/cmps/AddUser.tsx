import { useState } from 'react'
import { User } from '../models/user.model'
import { QuickAvatar } from './QuickAvatar'
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { channel } from 'diagnostics_channel'
import { useUserStore } from '@/lib/userStore'

export function AddUser() {
    const [user, setUser] = useState<User|null>(null)
    const { currentUser } = useUserStore()

    const handleSearch = async(e: any) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const username = formData.get('username')

        try {
            const userRef = collection(db, 'users')
            const q = query(userRef, where('username', '==', username))
            const querySnapshot = await getDocs(q)
            console.log(username)
            if (!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data() as User)
                console.log('user:', user)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleAdd = async() => {
        const chatRef = collection(db, 'chats')
        const userChatRef = collection(db, 'userChats')

        try{
            const newChatRef = doc(chatRef)

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
        })

        //TODO: if user already has a chat with this user, don't add it

        const docA = await doc(userChatRef, user!.id)
            await updateDoc(docA, {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: currentUser!.id,
                    updatedAt: Date.now()
                }),
            })
            
            await updateDoc(doc(userChatRef, currentUser!.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: user!.id,
                    updatedAt: Date.now()
                })
                
            })
    
    
        } catch(err){
            console.error('error:', err)
        }
    }
    return (
        <div className="absolute w-max h-max p-7 bg-myBlue rounded inset-0 m-auto">
            <form onSubmit={handleSearch} className="flex gap-5" action="">
                <input
                    className="p-5 rounded border-none outline-none bg-slate-50 placeholder:text-black text-black"
                    type="text"
                    placeholder="Username"
                    name="username"
                />
                <button className="p-5 rounded text-white bg-blue-600">Search</button>
            </form>
            {user && <div className="user mt-8">
                <div className="detail mt-5 flex items-center justify-between">
                    <div className='flex items-center gap-5'>

                    <QuickAvatar user={user} />
                    <span>{user.username}</span>
                    </div>
                    <button 
                        onClick={handleAdd}
                        className='p-3 bg-blue-600 text-white rounded'>Add User
                    </button>
                </div>
            </div>}
        </div>
    )
}