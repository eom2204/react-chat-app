import { useEffect, useRef } from 'react'

const ChatBox = ({chats}) => {
    const endOfMessages = useRef();
    const currentUser = `${localStorage.getItem('userName')} ${localStorage.getItem('userSurname')}`;


    function SenderChat ({message, user, avatar}) {
        return (
            <div className='chat_sender'>
                <img src={avatar} alt="" />
                <p>
                    <strong>{user}</strong> <br/>
                    {message}
                </p>
            </div>
        )
    }
    function ReceiverChat ({message, user, avatar}) {
        return (
            <div className='chat_receiver'>
                <img src={avatar} alt="" />
                <p>
                    <strong>{user}</strong> <br/>
                    {message}
                </p>
            </div>
        )
    }
    useEffect(() => {
        scrollToBottom()
    }, [chats])

    const scrollToBottom = () => {
        endOfMessages.current?.scrollIntoView({behavior: "smooth"})
    }
  return (
    <div className='chats_list'>
        {
            chats.map((chat, index) => {
                if(chat.user === currentUser) {
                    return <SenderChat 
                    key={index}
                    message = {chat.message}
                    user = {chat.user}
                    avatar = {chat.avatar}/>
                }
                 else {
                    return <ReceiverChat 
                    key={index}
                    message = {chat.message}
                    user = {chat.user}
                    avatar = {chat.avatar}/>
                 }
            })
        }
        <div ref={endOfMessages}></div>
    </div>
  )
}

export default ChatBox