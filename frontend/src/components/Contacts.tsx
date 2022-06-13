import React from 'react'
import { ICreateUser } from '../interfaces/I.CreateUser'

interface Props {
    user: ICreateUser,
    chooseChat(userName: string): void
}

function Contacts({user, chooseChat}: Props) {
  return (
    <div className='contactRow'>
        <button onClick={() => {chooseChat(user.name)}}>
            <h2>{user.name}</h2>
        </button>
        <div className={user.unreaded ? 'unreaded' : 'readed'}></div>
    </div>
  )
}

export default Contacts