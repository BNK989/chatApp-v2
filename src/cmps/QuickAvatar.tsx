import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import { User } from '@/models/user.model'
export function QuickAvatar({user, className} : {user: User, className?: string}) {
    return (
            <Avatar className={cn("w-12 h-12", className)}>
                <AvatarImage loading='lazy' src={user?.avatar} />
                <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
            </Avatar>
    )
}
