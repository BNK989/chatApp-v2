/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { UserCredential, createUserWithEmailAndPassword, getRedirectResult, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, gProvider } from '@/lib/firebase'
import { upload } from '@/lib/upload'
import { RotatingLines } from 'react-loader-spinner'
// import logger from '../logger'

interface UserRegistration {
    username?: string
    email?: string
    password?: string
}

type UserType = UserCredential['user']
declare interface FullUser extends UserType {
    createdAt: Date
    lastLoginAt: Date
    metadata: {
        createdAt : string
        lastLoginAt : string
        lastSignInTime : string
        creationTime : string
    }
}

export function Login() {
    const { toast } = useToast()

    const [avatar, setAvatar] = useState({
        file: null,
        url: '',
    })
    const [loading, setLoading] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    useEffect( () => {
        if( window.innerWidth < 768) {
            getRedirectResult(auth)
            .then(async (result) => {
                if(!result) throw new Error('No redirect result')
                    logIn(result.user as FullUser)
                })
            .catch(err => {
                console.error('from promise error:',err)})
        }
    }, [])

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
          await signInWithEmailAndPassword(auth, email, password)

          toast({
            className: 'bg-myBlue text-white border-none max-w-[75dvw] border-b-2 border-green-500',
            title: 'Success',
            description: 'Logged in successfully',
            duration: 2000,
            
          })
          window.location.reload()

        }
        catch(err){
            console.error(err)
            toast({
                className: 'bg-black text-white border-none max-w-[75dvw] border-b-2 border-red-500',
                title: 'Error while logging in',
                description: 'Please try again',
                
            })
        }
        finally{
          setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {

        try {
   
            if( window.innerWidth < 768) {
                await signInWithRedirect(auth, gProvider) 
                
            }else{
                await signInWithPopup(auth, gProvider) 
                .then( async (result) => {
                    if(!result) throw new Error('No redirect result')
                        logIn(result.user as FullUser)
                }).catch((error) => {
                    console.error('from promise error:',error)
                })
            }

            toast({
                className: 'bg-black text-white border-none max-w-[75dvw] border-b-2 border-green-500',
                title: 'Success',
                description: 'Logged in successfully',
            })
            window.location.reload()
        } catch (err) {
            console.error(err)
            toast({
                className: 'bg-black text-white border-none max-w-[75dvw] border-b-2 border-red-500',
                title: 'Error while logging in',
                description: 'Please try again',
            })
        }
    }

    const logIn = async (user: FullUser) => {
        const {uid, displayName, email, photoURL: avatar} = user
        const username = displayName?.toLocaleLowerCase()
        const lastSignInTime = new Date(+user.metadata.lastLoginAt).getTime()
        const createdAt = new Date(+user.metadata.createdAt).getTime()

        const isNew = Math.abs(
            (lastSignInTime - createdAt ) / 1000
        ) < 120
        // logger.info(new Date(user.metadata.lastSignInTime!).getTime())


     if(isNew) {
         await setDoc(doc(db, 'users', uid), {
             username,
             email,
             avatar,
             id: uid,
             blocked: [],
         })

         await setDoc(doc(db, 'userChats', uid), {
           chats: [],
         })   
        }
        window.location.reload()
    }

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(avatar.file === null) {
            toast({
                className: 'bg-black text-white border-t-0 border-x-0 max-w-[75dvw] border-b-2 border-red-500',
                title: 'Error',
                description: 'Please upload an avatar',
            })
            return
        }
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const formDataObject = Object.fromEntries(formData) as UserRegistration
        let { username, email } = formDataObject
        const { password } = formDataObject
        username = username?.toLowerCase()
        email = email?.toLowerCase()
        
        
        if (!username || !email || !password) return
        if (password.length < 6){

            toast({
                className: 'bg-myBlue text-white border-x-0 border-t-0 max-w-[75dvw] border-b-4 border-red-500',
                title: 'Opps password too short',
                description: 'Password must be at least 6 characters long',
                duration: 2000,
                
            })
            setLoading(false)
             throw new Error('Password must be at least 6 characters long')
            }

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)

            const imgUrl = await upload(avatar.file!)

            await setDoc(doc(db, 'users', res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: [],
            })

            await setDoc(doc(db, 'userChats', res.user.uid), {
              chats: [],
            })

            await signInWithEmailAndPassword(auth, email, password)
            window.location.reload()

            toast({
                className: 'bg-black text-white border-none max-w-[75dvw]',
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
        <div className="login w-screen md:w-full h-full items-center flex ">
            <div className={`item flex flex-1 flex-col gap-5 items-center ${isRegister ? 'flex' : 'hidden'} md:flex`}>
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
                <div className="block md:hidden">
                    <h5>Don't have an account?</h5>
                    <button onClick={() => setIsRegister(prev => !prev)} className="w-full py-3 rounded-md bg-myBlue font-medium cursor-pointer">Sign up</button>
                </div>
                <div className="signInWithGoogle">
                    <button onClick={handleGoogleSignIn}>Sign in with Google</button>
                </div>
            </div>
            <div className="separator h-4/5 w-[2px] bg-myBorder hidden md:block"></div>


            {/*: REGISTER */}
            <div className={`item flex-1 flex-col gap-5 items-center ${!isRegister ? 'flex' : 'hidden'} md:flex`}>
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
                <div className="block md:hidden">
                    <h5>Already have an account?</h5>
                    <button onClick={() => setIsRegister(prev => !prev)} className="w-full py-3 rounded-md bg-myBlue font-medium cursor-pointer">Sign in</button>
                </div>
                <div className="signInWithGoogle">
                    <button onClick={handleGoogleSignIn}>Sign up with Google</button>
                </div>
            </div>
        </div>
    )
}