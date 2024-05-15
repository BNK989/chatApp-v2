import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AddUser() {
    return (
        <div className="absolute w-max h-max p-7 bg-myBlue rounded inset-0 m-auto">
            <form className="flex gap-5" action="">
                <input
                    className="p-5 rounded border-none outline-none bg-slate-50 placeholder:text-black"
                    type="text"
                    placeholder="Username"
                    name="username"
                />
                <button className="p-5 rounded text-white bg-blue-600">Search</button>
            </form>
            <div className="user mt-8">
                <div className="detail mt-5 flex items-center justify-between">
                    <div className='flex items-center gap-5'>

                    <Avatar className='w-12 h-12'>
                        <AvatarImage src="./avatar.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>Jane Doe</span>
                    </div>
                    <button className='p-3 bg-blue-600 text-white rounded'>Add User</button>
                </div>
            </div>
        </div>
    )
}
