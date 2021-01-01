const http = require('http');
const express = require('express');
const path = require('path');
const socketio=require('socket.io');  //its a protocol separate to http which allows us bidirectional communications
const Filter = require('bad-words');
const  { generateMessage }= require('./utils/message');
const  { generateLocationMessage }= require('./utils/message');
const  { generateImageMessage }= require('./utils/message');
const { addUser,removeUser,getUser,getUsersInRoom,deleteRoom,createRoom }=require('./utils/user')
const app=express()
const server=http.createServer(app)  //express creates a server by default but here we need it so we are declaring it implicitly
const io=socketio(server)
const port=process.env.PORT||3000;
const pathName=path.join(__dirname,'/public')




let msg='Welcome to the Server'

app.use(express.static(pathName))

io.on('connection',(socket)=>{             //here we are listening for an event namely a connection  //here it accepts an object called socket containing information about the event

  socket.on('join',({username,room,password,confirm},callback)=>{
    if(confirm){
      let {error,roomData}=createRoom(username,room,password,confirm)
      if(error){
        return callback(error);
      }
    }
      const { error,user }=addUser({id:socket.id,username,room,password})
      if(error){
        return callback(error);
      }
      socket.join(user.room)      //it joins the user to a particular room so users can emit messages to this room only
      socket.emit('message',generateMessage('Admin',msg));                //emit is used to send information back to connected clients first argument is an event it can be custom
      socket.broadcast.to(user.room).emit('message',generateMessage('Admin','A new user '+user.username+' has joined'))   //socket.broadcast sends a message to all users except that one user
      io.to(user.room).emit('userList',{
        room:user.room,
        users:getUsersInRoom(user.room)
      })
    callback()
  })

socket.on('sendMessage',(message,callback)=>{
   const user=getUser(socket.id)
    let filter=new Filter()
    if(filter.isProfane(message)){
      return callback('Profanity is not allowed')
    }
    io.to(user.room).emit('message',generateMessage(user.username,message))               //io.emit sends the data to all connected users while socket.emit sends it to only one user
    callback()
  })

  socket.on('Location',(loc,callback)=>{
    const user=getUser(socket.id)
    io.to(user.room).emit('transferlocation',generateLocationMessage(user.username,'https://google.com/maps?q='+loc.lat+','+loc.lon))
    callback()                               //callback is called to acknowledge the event
  })


  socket.on('image',(file,callback)=>{
    const user=getUser(socket.id)
    io.to(user.room).emit('transferImage',generateImageMessage(user.username,file))
    callback()
  })

  socket.on('disconnect',()=>{
      const user=removeUser(socket.id)
      if (user) {
        io.to(user.room).emit('message',generateMessage('Admin','A User has left the server'))
        let roomData={
          room:user.room,
          users:getUsersInRoom(user.room)
        };
        io.to(user.room).emit('userList',roomData)
        if(!roomData.users.length){
          deleteRoom(roomData.room)
        }
      }
  })

})

server.listen(port,()=>{
  console.log('Server Running on port'+port);
})
