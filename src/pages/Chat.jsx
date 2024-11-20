import React,{useState,useEffect,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { styled} from "styled-components";
import axios from "axios";
import { allUsersRoute,host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import loader from "../loader.gif"
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import {io} from "socket.io-client"

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const[contacts,setContacts] = useState([]);
  const[currentUser,setCurrentUser] = useState(undefined);
  const[loading,setLoading]  = useState(true);
  const[currentChat,setCurrentChat] = useState(undefined);

  useEffect(()=>{
    const func = async()=>{
      if(!localStorage.getItem("chat-app-user")){
        navigate("/login");
      }
      else{
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      }
    }
    func();

  },[])

  useEffect(()=>{
    if(currentUser){
      socket.current = io(host)
      socket.current.emit("add-user",currentUser._id);
    }
  },[currentUser])

  const handleChatChange = (chat)=>{
    setCurrentChat(chat);
    console.log(currentChat);
  }

  useEffect(()=>{
    const func = async()=>{
      if(currentUser){
        if(currentUser.isAvatarSet){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          console.log("data:",data.data);
          setContacts(data.data);
          setLoading(false);
        }
        else{
          navigate("/setAvatar")
        }
      }
    }
    func();

    
  },[currentUser])


  return (
    <>
    {
      loading?<Container>  
      <img src = {loader} alt = "loader" className = "loader"/>
  </Container>:
  <Container>
    
  <div className="container">
    
  <Contacts contacts = {contacts} currentUser = {currentUser} changeChat = {handleChatChange}/>
  {
      currentChat===undefined?
      <Welcome currentUser = {currentUser}/>
      :
      <ChatContainer currentChat = {currentChat} currentUser = {currentUser} socket = {socket}/>

    }
  
  </div>
</Container>

    }
    </>
    
  );
}

const Container = styled.div`
height:100vh;
width:100vw;
display:flex;
flex-direction:column;
justify-content:center;
gap:1rem;
align-items:center;
background-color:#131324;
.container{
  height:85vh;
  width:85vw;
  background-color:#00000076;
  display:grid;
  grid-template-columns:25% 75%;
  @media screen and (min-width:720px) and (max-width:1080px){
    grid-template-columns:35% 65%;
  }
  @media screen and (min-width:360px) and (max-width:480px){
    grid-template-columns:35% 65%;
  }

}
`;

export default Chat ;
