import { IMessageDto } from '../interfaces/I.Message.dto';

import EditIcon from '../resources/edit-icon.svg';
import ChatOptions from '../resources/chat-options-ui-icon.svg';
import axios from 'axios';
import { ChangeEvent, useState } from 'react';

interface Props {
  message: IMessageDto
}

function Message({ message }: Props) {

  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState<boolean>(false);

  const [messageToUpdate, setMessageToUpdate] = useState<string>(message.message);

  const token: any = localStorage.getItem('token');


  const openOptionsMenu = () => {
    let options = document.getElementById('optionsMenu'+message.id);
    let edit = document.getElementById('editMessage'+message.id);
    let original = document.getElementById('message'+message.id);

    if(options && edit && original){
      if(openOptions === false){
        setOpenOptions(true)
        options.style.display = 'flex'
        setEditMessage(false)
        edit.style.display = 'none'
        original.style.display = 'none'
      } else {
        setOpenOptions(false)
        options.style.display = 'none'
        original.style.display = 'block'
      }
    }
  }

  const openEditingContainer = () => {
    let options = document.getElementById('optionsMenu'+message.id);
    let edit = document.getElementById('editMessage'+message.id);
    let original = document.getElementById('message'+message.id);

    if(options && edit && original){
      if(editMessage === false){
        setEditMessage(true)
        edit.style.display = 'block'
        setOpenOptions(false)
        options.style.display = 'none'
        original.style.display = 'none'
      } else {
        setEditMessage(false)
        edit.style.display = 'none'
        original.style.display = 'block'
      }
    }
  }

  const deleteOption = async (evt: any) => {
    evt.preventDefault();

    const resp = await axios.post('http://127.0.0.1:8000/api/auth/delete', {
      id: message.id,
    }, {
      headers: {"Authorization": `Bearer ${token}`}
    })

    let messageToDelete = document.getElementById('chatMessage'+message.id);

    if(messageToDelete){
      messageToDelete.style.display = 'none';
    }
  }

  const editMessageOption = async (evt: any) => {
    evt.preventDefault();

    const resp = await axios.put('http://127.0.0.1:8000/api/auth/edit', {
      edited: message.id,
      message: messageToUpdate
    }, {
      headers: {"Authorization": `Bearer ${token}`}
    })

    let edit = document.getElementById('editMessage'+message.id);
    let original = document.getElementById('message'+message.id);
    let messageBox = document.getElementById('normalMessage'+message.id);

    if(edit && original && messageBox){
      setEditMessage(false)
      edit.style.display = 'none'
      original.style.display = 'block'
      messageBox.innerHTML = messageToUpdate;
    }
  }

  const editedMessage = () => {
    if(message.edited === 1){
      return ' - edited';
    } else {
      return ;
    }
  }

  const onEnterPress = (evt: any) => {
    if(evt.keyCode === 13 && evt.shiftKey === false) {
      editMessageOption(evt);
    }
  }

  const update = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageToUpdate(evt.target.value);
  }

  return (
    <div 
      className={message.side ? 'sentMessage' : 'receivedMessage'}
      id={'chatMessage'+message.id}>
      <div 
        className='icons'
        style={message.side ? {display: 'inherit'} : {display: 'none'}}>
        <img 
          src={ChatOptions} 
          alt="chat-options-icon" 
          className='icon' 
          style={message.sent ? {display: 'none'} : {display: 'inherit'}}
          onClick={() => openOptionsMenu()}/>
        <img 
          src={EditIcon} 
          alt="edit-icon" 
          className='icon'
          style={message.sent ? {display: 'none'} : {display: 'inherit'}} 
          onClick={() => openEditingContainer()}/>
      </div>
      <div 
        className='message options'
        id={'optionsMenu'+message.id}
        style={{display: 'none'}}>
          <button 
            id='deleteMessageButton'
            onClick={(evt) => deleteOption(evt)}>
              Delete message
          </button>
      </div>
      <div 
        className='message'
        id={'editMessage'+message.id}
        style={{display: 'none'}}>
          <textarea
            name="messageUpdateField" 
            id="messageToUpdate"
            maxLength={7000}
            value={messageToUpdate}
            onKeyDown={(evt) => onEnterPress(evt)}
            onChange={(evt) => update(evt)}/>
          <button
            id='messageUpdateButton'
            onClick={(evt) => editMessageOption(evt)}>
              Edit message
          </button>
      </div>
      <div className='message' id={'message'+message.id}>
          <h3>{message.sender}</h3>
          <p id={'normalMessage'+message.id}>{message.message}</p>
          <h5>{message.sent_date}{editedMessage()}</h5>
      </div>
    </div>
  )
}

export default Message