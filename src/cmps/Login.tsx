import { FormEvent, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
// import { BlockList } from 'net'
import { upload } from '@/lib/upload'
import { RotatingLines } from 'react-loader-spinner'

interface UserRegistration {
    username?: string
    email?: string
    password?: string
}

export function Login() {
    const { toast } = useToast()

    const [avatar, setAvatar] = useState({
        file: null,
        url: '',
    })
    const [loading, setLoading] = useState(false)

    const handleAvatar = (e: any) => {
        if (!e.target.files[0]) return
        setAvatar({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })
    }

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const formDataObject = Object.fromEntries(formData) as UserRegistration
        const { email, password } = formDataObject
        console.log('formDataObject:', formDataObject)
        
        if (!email || !password) return
        setLoading(true)
        try{
          console.log('trying:')
          await signInWithEmailAndPassword(auth, email, password)

          toast({
            className: 'bg-black text-white border-none left-[-100px] border-b-2 border-green-500',
            title: 'Success',
            description: 'Logged in successfully',
            
          })
        }
        catch(err){
            console.error(err)
            toast({
                className: 'bg-black text-white border-none left-[-100px] border-b-2 border-red-500',
                title: 'Error while logging in',
                description: 'Please try again',
                
            })
        }
        finally{
          setLoading(false)
        }
    }

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const formDataObject = Object.fromEntries(formData) as UserRegistration
        const { username, email, password } = formDataObject

        if (!username || !email || !password) return

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)

            const imgUrl = await upload(avatar.file!)

            await setDoc(doc(db, 'users', res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                Blocked: [],
            })

            await setDoc(doc(db, 'userChats', res.user.uid), {
              chats: [],
            })

            toast({
                className: 'bg-black text-white border-none left-[-100px]',
                title: 'Register successful',
                duration: 4000,
            })
        } catch (err) {
            console.error('err:', err)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="login w-full h-full items-center flex ">
            <div className="item flex flex-1 flex-col gap-5 items-center">
                <h2>Welcome back,</h2>
                <form onSubmit={handleLogin} className="flex flex-col items-center justify-center gap-5">
                    <input
                        className="p-2 bg-myBlue rounded-sm outline-none text-slate-200"
                        type="text"
                        placeholder="Email"
                        name="email"
                    />
                    <input
                        className="p-2 bg-myBlue rounded-sm outline-none text-slate-200"
                        type="password"
                        placeholder="password"
                        name="password"
                    />
                    <button disabled={loading} className="w-full py-3 rounded-md bg-blue-600 font-medium cursor-pointer disabled:opacity-75">Sign in</button>
                </form>
            </div>
            <div className="separator h-4/5 w-[2px] bg-myBorder"></div>
            <div className="item flex flex-1 flex-col gap-5 items-center">
                {/*: REGISTER */}
                <h2>Create an account</h2>
                <form onSubmit={handleRegister} className="flex flex-col items-center justify-center gap-5">
                    <label htmlFor="file" className="w-full flex items-center gap-5 cursor-pointer underline">
                        <img
                            className="w-10 h-10 rounded-full opacity-60"
                            src={avatar.url || './avatar.png'}
                            alt="Avatar"
                        />
                        Upload an Image
                    </label>
                    <input
                        className="p-2 bg-myBlue rounded-sm outline-none text-slate-200"
                        type="file"
                        id="file"
                        placeholder="username"
                        name="username"
                        onChange={handleAvatar}
                        hidden
                    />
                    <input
                        className="p-2 bg-myBlue rounded-sm outline-none text-slate-200"
                        type="text"
                        placeholder="username"
                        name="username"
                    />
                    <input
                        className="p-2 bg-myBlue rounded-sm outline-none text-slate-200"
                        type="text"
                        placeholder="Email"
                        name="email"
                    />
                    <input
                        className="p-2 bg-myBlue rounded-sm outline-none text-slate-200"
                        type="password"
                        placeholder="password"
                        name="password"
                    />
                    <button disabled={loading} className="flex justify-center gap-2 items-center w-full py-3 rounded-md bg-blue-600 font-medium cursor-pointer disabled:opacity-75">
                      <RotatingLines visible={loading} strokeColor="white" strokeWidth="2" animationDuration="0.95" width='20'  />
                      {loading ? 'Loading' : 'Sign up'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
