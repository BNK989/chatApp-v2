import { useState } from 'react'
// import Notifications from '../notifications'

export function Login(){

  const [avatar, setAvatar] = useState({
    file:null,
    url:''
  })

  const handleAvatar = (e:any) => {
    if(!e.target.files[0]) return
    setAvatar({file: e.target.files[0], 
    url: URL.createObjectURL(e.target.files[0])})
  }
  return (
    <div className='login w-full h-full items-center flex'>
      <div className="item flex flex-1 flex-col gap-5 items-center">
        <h2>Welcome back,</h2>
        <form className='flex flex-col items-center justify-center gap-5'>
          <input className='p-2 bg-myBlue rounded-sm outline-none text-slate-200' type="text" placeholder='Email' name='Email'/>
          <input className='p-2 bg-myBlue rounded-sm outline-none text-slate-200' type="password" placeholder='password' name='password' />
          <button className='w-full py-3 rounded-md bg-blue-600 font-medium cursor-pointer'>Sign in</button>
        </form>
      </div>
      <div className="separator h-4/5 w-[2px] bg-myBorder"></div>
      <div className="item flex flex-1 flex-col gap-5 items-center">
        <h2>Create an account</h2>
        <form className='flex flex-col items-center justify-center gap-5'>
          <label htmlFor="file" className='w-full flex items-center gap-5 cursor-pointer underline'>
          <img className='w-10 h-10 rounded-full opacity-60' src={avatar.url || './avatar.png'} alt="Avatar" />
          Upload an Image
          </label>
          <input className='p-2 bg-myBlue rounded-sm outline-none text-slate-200' type="file" id='file' placeholder='username' name='username' onChange={handleAvatar} hidden/>
          <input className='p-2 bg-myBlue rounded-sm outline-none text-slate-200' type="text" placeholder='username' name='username'/>
          <input className='p-2 bg-myBlue rounded-sm outline-none text-slate-200' type="text" placeholder='Email' name='Email'/>
          <input className='p-2 bg-myBlue rounded-sm outline-none text-slate-200' type="password" placeholder='password' name='password' />
          <button className='w-full py-3 rounded-md bg-blue-600 font-medium cursor-pointer'>Sign up</button>
          {/* <Notifications/> */}
        </form>
      </div>
    </div>
  )
}

export default Login