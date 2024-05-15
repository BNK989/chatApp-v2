import React from 'react'
import UserInfo from './UserInfo'
import ChatList from './ChatList'

export function List(){
  return (
    <div className='list flex flex-1 flex-col'>
        <UserInfo></UserInfo>
        <ChatList></ChatList>
    </div>
  )
}

export default List