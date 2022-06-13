import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react'
import Contacts from '../components/Contacts';
import Message from '../components/Message';
import { ICreateUser } from '../interfaces/I.CreateUser';
import { IMessageDto } from '../interfaces/I.Message.dto';
import '../styles/Chats.css'
import '../styles/Contacts.css'

function Chats() {
  
  const [messages, setMessages] = useState<IMessageDto[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>('');

  const [users, setUsers] = useState<ICreateUser[]>([]);
  const [loginName, setLoginName] = useState<string>('');

  const [openedName, setOpenedName] = useState<string>('');
  const [openedChat, setOpenedChat] = useState<boolean>(false);

  const token = localStorage.getItem('token');

  const update = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageToSend(evt.target.value);
  }

  /**
   * Sends the new message
   * @param evt preventdefault
   */
  const sendMessage = async (evt: any) => {
    evt.preventDefault();
    if(messageToSend.length > 0){
      const resp = await axios.post('http://127.0.0.1:8000/api/auth/send', {
        sender: loginName,
        receiver: openedName,
        message: messageToSend
      }, {
        headers: {"Authorization": `Bearer ${token}`}
      })

      setMessageToSend('');

      let inputField = document.getElementById('messageField');
      if(inputField){
        inputField.focus();
      }
    }
  }

  /**
   * 
   * @returns message boxes if a chat is opened, returns default 
   * text when no there is no opened chat
   */
  const showMessages = () => {
    const textarea = document.getElementById('messageField');
    const sendButton = document.getElementById('sendButton');
    if(openedChat){
      if(textarea){
        textarea.style.display = 'inherit'
      }

      if(sendButton){
        sendButton.style.display = 'inherit'
      }

      return messages.map((message: IMessageDto, key: number) => {
        return <Message key={key} message={message}/>;
      })
    } else {
      if(textarea){
        textarea.style.display = 'none'
      }

      if(sendButton){
        sendButton.style.display = 'none'
      }

      return (
        <div className="noChat">
          <h1>Open a chat to start messaging</h1>
        </div>
      );
    }
  }

  /**
   * Gets all users from server
   * Checks if any of them sent a new message
   * Set users list
   */
  const getContacts = async () => {
    const resp = await axios.get('http://127.0.0.1:8000/api/auth/users', {
      headers: {"Authorization": `Bearer ${token}`}
    })

    const alertresp = await axios.get('http://127.0.0.1:8000/api/auth/chats',{
      headers: {"Authorization": `Bearer ${token}`}
    })
    
    let alerts = JSON.parse(JSON.stringify(alertresp.data))
    let contacts = JSON.parse(JSON.stringify(resp.data))
    let contactList: ICreateUser[] = [];
    let newUser = {
      name: 'dummy',
      unreaded: false
    };

    contacts.users.forEach((name: string) => {
      
      if(alerts.received.length > 0){
      
        for(let i = 0; i < alerts.received.length; i++) {
          if(alerts.received[i] === name){
           
            newUser = {
              name: name,
              unreaded: true
            }

          } else {
           
            newUser = {
              name: name,
              unreaded: false
            }

          }
        }
      } else {
        newUser = {
          name: name,
          unreaded: false
        }
      }

      contactList.push(newUser);
    });
    
    setUsers(contactList);
  }

  /**
   * 
   * @param collection generic for the lists that is in response
   * @param list List to fill up
   * @returns list of messages
   */
  const loadMessages = (collection: any, list: any) => {
    collection.forEach((item: any) => {
      let newMessage = {
        sender: item.sender,
        receiver: item.receiver,
        message: item.message,
        side: false
      };
      if(item.sender === loginName){
        newMessage.side = true;
      }
      list.push(newMessage);
    });
    return list;
  }

  /**
   * Sends request to server and get messages by sender-receiver
   */
  const getMessages = async () => {
    const resp = await axios.post('http://127.0.0.1:8000/api/auth/messages', {
      name: openedName
    }, {
      headers: {"Authorization": `Bearer ${token}`}
    })

    let receivedMessages = JSON.parse(JSON.stringify(resp.data));
    let messagesList: any = [];

    if(receivedMessages.readed){
      messagesList = loadMessages(receivedMessages.readed, messagesList);
    }

    if(receivedMessages.unreaded){
      messagesList = loadMessages(receivedMessages.unreaded, messagesList);
    }

    if(receivedMessages.sent){
      messagesList = loadMessages(receivedMessages.sent, messagesList);
    }
    if(messagesList.length != messages.length){
      setMessages(messagesList);
    }
  }

  /**
   * Updates users list, if there is an unreaded message, to readed
   */
  const getUnreadedOnUpdate = async () => {
    const alertresp = await axios.get('http://127.0.0.1:8000/api/auth/chats',{
      headers: {"Authorization": `Bearer ${token}`}
    })
    
    let alerts = JSON.parse(JSON.stringify(alertresp.data))
    let tempContacts = users;

    if(alerts.received !== 'nope'){
      alerts.received.forEach((name: string) => {
        for(let i = 0; i < tempContacts.length; i++) {
          if(tempContacts[i].name === name){
            tempContacts[i].unreaded = true;
          } else {
            tempContacts[i].unreaded = false;
          }
        }
      });
    } else {
      for(let i = 0; i < tempContacts.length; i++) {
        tempContacts[i].unreaded = false;
      }
    }

    setUsers(tempContacts);
  }

  /**
   * @returns Logged in user's name
   */
  const getLoggedInName = async () => {
    const resp = await axios.get('http://127.0.0.1:8000/api/auth/name', {
      headers: {"Authorization": `Bearer ${token}`}
    })

    setLoginName(resp.data)
    return loginName;
  }

  /**
   * @param userName User to chat with
   */
  const chooseChat = (userName: string) => {
    setMessages([]);
    setOpenedName(userName);
    setOpenedChat(true);
  }


  /**
   * Used to show users in the list
   * @returns User list components
   */
  const showUsers = () => {
    return users.map((user: ICreateUser, key: number) => {
      return <Contacts key={key} user={user} chooseChat={chooseChat}/>;
    })
  }

  /**
   * Set window height/position to the current place
   * it has to be
   */
  const updateView = () => {
    if(messages.length > 0){
      document.getElementsByClassName('showMessage')[0].scrollTop = document.getElementsByClassName('showMessage')[0].scrollHeight
    }
    if(messages.length > 0){
      document.getElementsByClassName('list')[0].scrollTop = document.getElementsByClassName('list')[0].scrollHeight
    }
  }

  const logout = () => {
    localStorage.setItem('loggedIn', 'false');
    localStorage.setItem('token', '');
    window.location.replace("http://localhost:3000/");
  }

  /**
   * 
   * @param evt Gets the key you press down, in this case its ENTER,
   * to send message from TextArea
   */
  const onEnterPress = (evt: any) => {
    if(evt.keyCode === 13 && evt.shiftKey === false) {
      sendMessage(evt);
    }
  }

  useEffect(() => {
    updateView();
  })
  
  useEffect(() => {
    if(openedChat){
      const interval = setInterval(async () => {
        await getMessages();
        await getUnreadedOnUpdate();
      }, 2000);
  
      return () => clearInterval(interval);
    }
  })

  useEffect(() => {
    getLoggedInName();
    getContacts();
  }, [])

  return (
    <div className='chatSite'>
        <div className="users">
            <div className="list">
              {showUsers()}
            </div>
            <div className="logout">
              <h1>Logged in as: {loginName}</h1>
              <button onClick={() => logout()}>Logout</button>
            </div>
        </div>
        <div className="chat">
            <div className="showMessage">
              {showMessages()}
            </div>
            <div className="sendMessage">
              <form onSubmit={(evt) => sendMessage(evt)}>
                <textarea
                  id='messageField'
                  maxLength={7000}
                  name='messageToSend'
                  placeholder='Your message...'
                  value={messageToSend}
                  onKeyDown={(evt) => onEnterPress(evt)}
                  onChange={(evt) => update(evt)}/>
                <div id='sendButton'>
                  <button>Send</button>
                </div>
              </form>
            </div>
        </div>
    </div>
  )
}

export default Chats