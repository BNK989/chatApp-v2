import { create } from 'zustand'

type State = {
    currentScreenIndex: number
    isLoading: boolean
    setCurrentScreenIndex: (index: number) => void
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAppStore = create<State>((set: (arg: any) => void) => ({
  currentScreenIndex: 0,
  isLoading: true,


  //Functions

  setCurrentScreenIndex: (index: number) => {
    set((prevState: State) => ({ ...prevState, currentScreenIndex: index }))
  },
}))

// changeBlock: () =>  {
//     set((prevState) => ({ ...prevState, isReceiverBlocked: !prevState.isReceiverBlocked }))
// },
//     if(!uid){
//         console.log('No uid:')
//         return set({currentUser: null, isLoading: false})
//     } 

// }))