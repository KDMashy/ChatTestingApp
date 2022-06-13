import React from 'react'
import { IMessageDto } from '../interfaces/I.Message.dto'

interface Props {
  message: IMessageDto
}

function Message({ message }: Props) {

  return (
    <div className={message.side ? 'sentMessage' : 'receivedMessage'}>
        <h3>{message.sender}</h3>
        <p>{message.message}</p>
        <h5>{message.created_at}</h5>
    </div>
  )
}

export default Message