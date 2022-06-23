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

    if(message.sent === false){
      await deleteCall(0);
    } else if(message.sent === true){
      await deleteCall(1);
    }

    let messageBox = document.getElementById('normalMessage'+message.id);
    let options = document.getElementById('optionsMenu'+message.id);
    let original = document.getElementById('message'+message.id);
    let icons = document.getElementById('chatOptionIcons'+message.id);

    if(messageBox && options && original && icons){
      messageBox.innerHTML = 'The message was deleted';
      options.style.display = 'none'
      original.style.display = 'block'
      icons.style.display = 'none'
    }
  }

  const deleteCall = async (readed: number) => {
    const resp = await axios.post('http://127.0.0.1:8000/api/auth/delete', {
      id: message.id,
      readed: readed
    }, {
      headers: {"Authorization": `Bearer ${token}`}
    })
  }

  const editMessageOption = async (evt: any) => {
    evt.preventDefault();

    if(message.sent === false){
      await editCall(0);
    } else if(message.sent === true){
      await editCall(1);
    }

    let edit = document.getElementById('editMessage'+message.id);
    let original = document.getElementById('message'+message.id);
    let messageBox = document.getElementById('normalMessage'+message.id);
    let messageDate = document.getElementById('sentDate'+message.id);


    if(edit && original && messageBox && messageDate){
      setEditMessage(false)

      let date = messageDate.innerHTML;

      edit.style.display = 'none'
      original.style.display = 'block'
      messageBox.innerHTML = messageToUpdate;
      messageDate.innerHTML = date + ' - edited';
    }
  }

  const editCall = async (readed: number) => {
    const resp = await axios.put('http://127.0.0.1:8000/api/auth/edit', {
      edited: message.id,
      message: messageToUpdate,
      readed: readed
    }, {
      headers: {"Authorization": `Bearer ${token}`}
    })
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
  
  const showIfDeleted = () => {
    if(message.deleted === 0) {
      return <p id={'normalMessage'+message.id}>{message.message}</p>
    } else {
      return <p id={'normalMessage'+message.id}>The message was deleted</p>
    }
  }
  return (
    <div 
      className={message.side ? 'sentMessage' : 'receivedMessage'}
      id={'chatMessage'+message.id}>
      <div 
        className='icons'
        id={'chatOptionIcons'+message.id}
        style={message.side ? {display: 'inherit'} : {display: 'none'}}>
        <img 
          src={ChatOptions} 
          alt="chat-options-icon" 
          className='icon' 
          style={message.deleted === 0 ? {display: 'inherit'} : {display: 'none'}}
          onClick={() => openOptionsMenu()}/>
        <img 
          src={EditIcon} 
          alt="edit-icon" 
          className='icon'
          style={message.deleted === 0 ? {display: 'inherit'} : {display: 'none'}}
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
          {showIfDeleted()}
          <h5 id={'sentDate'+message.id}>{message.sent_date}{editedMessage()}</h5>
      </div>
    </div>
  )
}

export default Message