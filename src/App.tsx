import Chat from './cmps/Chat'
import Detail from './cmps/Detail'
import { List } from './cmps/List'
import { Login } from './cmps/Login'
function App() {
    const user = true

    return (
        <div className="backdrop-blur-lg w-[80vw] h-[90vh] bg-myBlue rounded-xl backdrop-saturate-150 border border-myWhite flex">
        {user ? (
          <>
            <List/>
            <Chat></Chat>
            <Detail></Detail>
          </>
        ) : (
          <Login></Login>
        )}
      </div>
    )
}

export default App
