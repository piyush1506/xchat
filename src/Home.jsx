import { useEffect, useRef } from 'react'
import { useState } from 'react'
import axios from 'axios'
import './App.css'
import { useNavigate } from 'react-router-dom'
import {io} from 'socket.io-client'
// import { ZIMKit, ZIMKitProvider } from '@zegocloud/zimkit-react';
import { ZIM } from "zego-zim-web";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
// import socket from './socket'

import { ZIMKit, ZIMKitProvider } from '@zegocloud/zimkit-react';



  const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8000')


function Home() {


  
    const location = useLocation()

 const zpRef = useRef(null)
  // const {receiver} = location.state;
 const user = JSON.parse(localStorage.getItem('user'))
  const appID = 496043362;
      const  userID = user._id;
 
     const userName=user.name
       const serverSecret = "5e96d7e03b88a750639930817f46b35e";
      const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(appID,
         serverSecret,
         null,
         userID,
         userName
      )
 
      useEffect(()=>{
         const zp = ZegoUIKitPrebuilt.create(TOKEN);
         zpRef.current = zp
         zp.addPlugins({ZIM})
      },[TOKEN])
       
      function invite(calltype){
         console.log(receiver)
         if(!receiver) return
         const targetUser = {
             userID:receiver._id,
             userName:receiver.name
         };
         zpRef.current.sendCallInvitation({
             callees:[targetUser],
             callType:calltype,
             timeout:60
         }).then((res)=>{
             console.warn(res)
         })
         .catch((err)=>{
             console.warn(err);
         })
      }
      






  const navigate = useNavigate()
  const [users,setUsers]= useState([])
   const [isidebaropen,setIsidebaropen] = useState(false)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [onlineusers, setonlineusers] = useState([])
  const [receiver, setReceiver] = useState([])
  const [detail,setDetail] = useState({})
  const [senderId,setSenderId] = useState(null)
  const [istyping,setistyping] = useState(false)
  const [receiverId,setReceiverId] = useState(null)
  const bottomRef = useRef(null)
  const [typingUser,setTypingUser] = useState('')
  const typingTimeout  = useRef(null)
  const [conversationId, setConversationId] = useState(null);

useEffect(()=>{
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
    if(!token)return navigate('/register')
  //  console.log('user token',user,token)
   setDetail(user)
   setSenderId(user._id)
   socket.emit('addUser',user._id)

socket.on('getOnlineusers',(users)=>{
  setonlineusers(users)
})

socket.on('recieveMessage',(newmessage)=>{
  setMessages(prev=>[...prev,{
    text:newmessage.message,
    sender:newmessage.senderId,
    createdAt:newmessage.createdAt
  }])
})
socket.on('typing',({senderName})=>{
  setTypingUser(senderName)
  setistyping(true)
})
socket.on('stopTyping',()=>{
  setistyping(false)
  setTypingUser('')
})
 return ()=>{
  socket.off('getOnlineusers')
  socket.off('recieveMessage')
  socket.off('typing')
  socket.off('stopTyping')
 }

},[])

//  let conversationId ;
 

  useEffect(()=>{
    const getallUser = async()=>{
      const res  =await  axios.get(`${ import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/alluser`)
      const data =res.data
      console.log(data.users)
      setUsers(data.users)
    }
    getallUser()

  },[])

  
  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:'smooth'})
  },[messages])
 


   const setupConversation=async(user)=>{
   try {
      // setReceiverId(user._id)
         const payload = {receiverId:user._id,senderId}
      console.log(payload)
      // if(!receiverId || !senderId) return
       
      const res  =await  axios.post(`${ import.meta.env.VITE_API_URL||'http://localhost:8000'}/api/v1/conversation`,payload)
       console.log(res.data)
      const data =  res.data.conversation
         setConversationId(data._id);
         setReceiver(user)
         socket.emit('joinroom',{senderId,receiverId:user._id})
         
      console.log('data',data)


      // const response  =await  axios.post('http://localhost:8000/api/v1/message',)
      // const resdata =  res.data
        console.log('conversation id',conversationId)
           if(!conversationId) return
     const Res  =await  axios.post(`${ import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/allmessages`,{conversationId})
      const Resdata = Res.data
      console.log(Resdata)

   } catch (err) {
     console.error(err)
   }    
  }
  useEffect(() => {
  if (!conversationId) return;
 
  const getAllMessages = async () => {
    try {
      const res = await axios.post(`${ import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/allmessages`, { conversationId });
      console.log("Fetched messages:", res.data.messages.messages);
      setMessages(res.data.messages.messages)
    } catch (err) {
      console.error(err);
    }
  };

  getAllMessages();
}, [conversationId]);

const handleTyping = (e)=>{
  setMessage(e.target.value)
    socket.emit('typing',{
      receiverId:receiver._id,
      senderId,
      senderName:JSON.parse(localStorage.getItem('user')).name
    })
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(()=>{
      socket.emit('stopTyping',{receiverId:receiver._id})
    },2000)
  
}


   const handleSubmit = async(e)=>{
    e.preventDefault()
    if(message.length==0)return
      const payload = {message,senderId,conversationId}
      console.log(payload)
      const res  =await  axios.post(`${ import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/message`,payload)
      const newMessage =res.data.conversation.messages
      console.log('send message',res)
      setMessages(prev=>[...prev,newMessage.at(-1)])
      socket.emit('sendMessage',{
        senderId,
        receiverId:receiver._id,
        message,
        conversationId
      })
      socket.emit('stopTyping',{senderId,receiverId:receiver._id})
      // setUsers(data.users)
        setMessage('')
  }

  return (
    <div className="bg-[#e6e9eb] flex flex-col h-screen">
       <div className="min-h-[8%] w-max items-center px-3 flex ">
        <h1 className='text-3xl font-bold bg-gradient-to-l from-purple-400 to-pink-700 bg-clip-text text-transparent '>xchat</h1>
          </div>

        
        <div className="w-full flex flex-1 overflow-hidden bg-blue-100 ">
        
            <div className={`${conversationId ? 'hidden md:flex':'flex'} bg-[#e6e9eb] flex-col w-full md:w-[30%] bg-gray-300  h-auto`}>
                    <div className="text-2xl bg-slate-700 text-white p-3">
                <h1 className=''>contacts</h1>
            </div>
               <div className="scrollbar overflow-y-auto max-h-[83vh]">
                 {
                      users.map((user,index)=>(
                         <div onClick={()=>{setupConversation(user);}} key={index} value={user._id} className="bg-white bg-gradient-to-r from-violet-200 to-pink-200 shadow-md  m-2 p-1  text-gray-800 rounded-lg">
                    <span className=''><h1 className='text-2xl font-semibold '>{user.name} {user._id == detail._id ?'(you)':'' }</h1></span>
                    {
                      onlineusers.includes(user._id)&& (
                        <span className='w-3 h-3 bg-green-500 rounded-full'></span>
                      )
                    }
                 </div>
                      ))
                }
               </div>
                


            </div>
          { conversationId ? ( <div className={`flex flex-col w-full md:w-[70%] bg-[#e6e9eb] `}>
               <div className="flex items-center justify-between h-12 bg-gradient-to-r from-purple-800 to-red-300 w-full px-4">
  
  <div className="flex items-center gap-2">
    {/* back button — mobile only */}
    <button 
      onClick={() => setConversationId(null)} 
      className="text-white md:hidden text-xl font-bold">
      ←
    </button>
    <h2 className='text-xl text-white'>{receiver.name}</h2>
  </div>

  {/* icons — always visible */}
  <div className="text-white flex items-center">
    <button onClick={()=>invite(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)} className=''><i className="fa-solid fa-phone mx-3 text-xl"></i></button>
     <button onClick={()=>invite(ZegoUIKitPrebuilt.InvitationTypeVideoCall)}  className=''><i className="fa-solid fa-video mx-2 text-xl"></i></button>
  </div>

</div>
              
            <div className="flex mx-auto flex-col w-full h-full">
              <div className="flex scrollbar bg-slate-800 flex-col flex-1 overflow-y-auto max-h-[76vh] ">
           
                
              {   messages.map((message,index)=>( 
                 <div  className={`md:mx-4 px-2 flex items-start ${message.sender===detail._id ? 'justify-end ':'' }  my-2`}>
                    <span className={`text-xl p-1 text-white ${message.sender===detail._id ? 'bg-purple-600 rounded-bl-xl':'rounded-br-xl bg-white text-black'} shadow-sm px-3 rounded-t-xl `}><h2 className=''>{message.text}</h2></span>
                </div>
               ))} 
               <div ref={bottomRef} className=""></div>
               {istyping && <p className="text-gray-500 text-sm">{typingUser} is typing...</p>}
                 
               
               
                
              </div>
                    {/* <div className="flex mb-3 px-2 items-center gap-2 w-full"> */}
                <form onSubmit={handleSubmit} className='flex items-center gap-2 p-2 w-full'>
                        <input onChange={handleTyping} value={message} type='text'className='shadow-md outline-none flex-1 text-xl  mr-4 rounded-lg  bottom-2 h-12 ' placeholder='enter your mesage '/>
                      <button type='submit' className='bg-blue-500 text-xl p-2 rounded-md px-3 text-white'>send</button>
                </form>
                    {/* </div> */}
            </div>
             
            </div>)
            :(
             <div className="hidden md:flex items-center bg-slate-800 w-full justify-center mx-auto ">
               <h1 className='text-2xl text-white'>No conversation selected</h1>
             </div>
            )
            
          }
        </div>
     
    </div>
  )
}

export default Home
