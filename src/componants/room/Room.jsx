import React, { useEffect, useRef } from "react";
import { ZIMKit, ZIMKitProvider } from '@zegocloud/zimkit-react';
import { ZIM } from "zego-zim-web";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'


export default function Room (){
    const {receiverId} = useParams()
    const location = useLocation()

 const zpRef = useRef(null)
  const {receiver} = location.state;
 const user = JSON.parse(localStorage.getItem('user'))

      
     // generate Kit Token
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
     
     
    return (
        <div className="w-full h-screen flex items-center justify-center gap-5  bg-gradient-to-b   from-[#1a2229] to-black">
            <div className="w-[300px] h-[400px] bg-[#0d10114] border-2 flex flex-col border-gray-400">
                <h2 className="text-white text-[20px] "><span className="text-blue-500">username </span>{userName}</h2>
                <h2 className="text-white text-[20px]"><span  className="text-blue-500">userID </span>{userID}</h2>
            
         
                <button onClick={()=>invite(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)} className="w-[200px] bg-white  h-[50px] rounded-2xl ">voice call</button>
                <button onClick={()=>invite(ZegoUIKitPrebuilt.InvitationTypeVideoCall)} className="w-[200px] bg-white h-[50px] rounded-2xl m-3 ">video call</button>
            </div>
         
        </div>
    )
}