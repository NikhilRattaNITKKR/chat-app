const socket=io()
let form=document.getElementById('myForm')
let input=document.getElementById('input')
let submit=document.getElementById('submit')
let location1=document.getElementById('location')
let messagetemp=document.getElementById('message-template').innerHTML
let messageBox=document.getElementById('messageBox')
let locationtemp=document.getElementById('location-template').innerHTML
let sidebar=document.getElementById('sidebar')
let sidebartemp=document.getElementById('sidebar-template').innerHTML

const {username,room}=Qs.parse(location.search,{ ignoreQueryPrefix:true})
const autoscroll = () => {
  $messages=messageBox
 // New message element
 const $newMessage = $messages.lastElementChild
 // Height of the new message
 const newMessageStyles = getComputedStyle($newMessage)
 const newMessageMargin = parseInt(newMessageStyles.marginBottom)
 const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
 // Visible height
 const visibleHeight = $messages.offsetHeight
 // Height of messages container
 const containerHeight = $messages.scrollHeight
 // How far have I scrolled?
 const scrollOffset = $messages.scrollTop + visibleHeight
 if (containerHeight - newMessageHeight <= scrollOffset) {
 $messages.scrollTop = $messages.scrollHeight
 }
}

socket.on('transferlocation',(loca)=>{
  let html=Mustache.render(locationtemp,{username:loca.username,url:loca.url,createdAt:moment(loca.createdAt).format('h:m a')});
    messageBox.insertAdjacentHTML('beforeEnd',html)
    autoscroll()
})

socket.on('message',(msg)=>{
  let html=Mustache.render(messagetemp,{username:msg.username,message:msg.message,createdAt:moment(msg.createdAt).format('h:m a')});    //using the mustache library to render the template
  messageBox.insertAdjacentHTML('beforeEnd',html)         //inserts the html beforeEnd of the div tag that means inside
  autoscroll()
})

socket.on('userList',({room,users})=>{
const html=Mustache.render(sidebartemp,{
  room,
  users
})
sidebar.innerHTML=html
})

form.addEventListener('submit',(e)=>{
  e.preventDefault()      //e is the variable storing the event and here we stop it from executing its default state
  let msg=e.target.elements.message.value;      //e is the evemt target is the element we listens to and message is the name of the field we want to target
  submit.setAttribute('disabled','disabled')
  socket.emit('sendMessage',msg,(error)=>{  //we can setup a callback function to acknowledge the event
    submit.removeAttribute('disabled')
    input.value=''
    input.focus()
    if(error){
      return console.log('Profanity is not allowed');
    }
  })
})

location1.addEventListener('click',(e)=>{
  if(!navigator.geolocation){
    return alert('Cannot get location');
  }
  location1.setAttribute('disabled','disabled')

  navigator.geolocation.getCurrentPosition((position)=>{
    console.log(navigator.geolocation);
    socket.emit('Location',{
      lat:position.coords.latitude,
      lon:position.coords.longitude,
    },()=>{
      console.log('Location Shared');
      location1.removeAttribute('disabled')
    });
  })
})


socket.emit('join',{username,room},(error)=>{
  if (error){
    alert(error)
    location.href='/'
  }
})
