import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

export function Notification() {
    const { toast } = useToast()

    return (
        <div className="notification">
            <Button
                className="mt-4"
                variant="outline"
                onClick={() => {
                    toast({
                        title: 'Scheduled: Catch up ',
                        description: 'Friday, February 10, 2023 at 5:57 PM',
                        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                        duration: 1000,
                        draggable: true,
                    })
                }}>
                Test Notification
            </Button>
        </div>
    )
}
