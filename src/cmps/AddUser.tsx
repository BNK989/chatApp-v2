import { useState } from 'react'
import { User } from '../models/user.model'
import { QuickAvatar } from './QuickAvatar'
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUserStore } from '@/lib/userStore'

export function AddUser({ closeSelf }: { closeSelf: () => void }) {
    const [users, setUsers] = useState<User[]>([])
    const [chatsIds, setChatsIds] = useState<string[]>([])
    const { currentUser } = useUserStore()
    //TODO get active chat list

    const getActiveChats = async () => {
        const activeChats = await getDoc(doc(db, 'userChats', currentUser!.id))
        const { chats } = activeChats.data()!
        const chatsIds = chats.map((c: any) => c.receiverId)
        setChatsIds(chatsIds)
    }

    const handleSearch = async (e: any) => {
        e.preventDefault();
        getActiveChats();
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
    
        try {
            const userRef = collection(db, 'users');
    
            // This assumes you have an index set up on the 'username' field
            const q = query(userRef, where('username', '>=', username.toLowerCase()), where('username', '<=', username.toLowerCase() + '\uf8ff'));
            const querySnapshot = await getDocs(q);
    
            // console.log('querySnapshot:', querySnapshot.docs.map((d) => d.data()) as User[]);
            if (!querySnapshot.empty) {
                const users = querySnapshot.docs.map((d) => d.data()) as User[];
    
                // Further filter results on the client side to match the partial string anywhere in the username
                const filteredUsers = users.filter(user => user.username.toLowerCase().includes(username.toLowerCase()));
    
                setUsers(filteredUsers);
            }
        } catch (err) {
            console.error(err);
        }
    }    

    const handleAdd = async (user: User) => {
        const chatRef = collection(db, 'chats')
        const userChatRef = collection(db, 'userChats')

        try {
            const newChatRef = doc(chatRef)

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            })

            //TODO: if user already has a chat with this user, don't add it

            const docA = await doc(userChatRef, user!.id)
            await updateDoc(docA, {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: currentUser!.id,
                    updatedAt: Date.now(),
                }),
            })

            await updateDoc(doc(userChatRef, currentUser!.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: user!.id,
                    updatedAt: Date.now(),
                }),
            })
            closeSelf()
        } catch (err) {
            console.error('error:', err)
        } 
    }
    return (
        <div className="absolute max-w-[75dvw] h-max p-7 bg-myBlue rounded inset-0 m-auto md:w-1/3">
            <button onClick={closeSelf} className="close absolute -top-3 -right-2 rounded bg-myBlue px-2">
                X
            </button>
            <form onSubmit={handleSearch} className="flex gap-5 flex-wrap" action="">
                <input
                    className="p-5 rounded border-none outline-none bg-slate-50 placeholder:text-black text-black flex-1"
                    type="text"
                    placeholder="Username"
                    name="username"
                />
                <button className="p-5 rounded text-white bg-blue-600 flex-1">Search</button>
            </form>
            {users.length > 0 && (
                <div className="user mt-8">
                    <div className="detail mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-5 flex-col w-full">
                            {users.map((user) => {
                                return (
                                    <div className='w-full flex justify-between items-center'>
                                        <div className="flex gap-3 items-center">
                                            <QuickAvatar key={user.id} user={user} className='w-8 h-8 md:w-12 md:h-12'/>
                                            <span className="capitalize text-sm md:text-base">{user.username}</span>
                                        </div>
                                        <button disabled={chatsIds.includes(user.id)} onClick={() => handleAdd(user)} className={`min-w-20 p-2 text-sm md:text-base ${chatsIds.includes(user.id) ? 'bg-blue-300' : 'bg-blue-600'} text-white rounded`}>
                                            {chatsIds.includes(user.id) ? 'Added' : 'Add User'}
                                        </button>
                                    </div>
                                )
                            })}

                        </div>
        
                    </div>
                </div>
            )}
        </div>
    )
}
