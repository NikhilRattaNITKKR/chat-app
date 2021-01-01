var users=[];
var rooms=[];

const createRoom=(username,name,password,confirm)=>{
  name=name.trim().toLowerCase()
  password=password.trim().toLowerCase()
  username=username.trim().toLowerCase()
  confirm=confirm.trim().toLowerCase()

  if (!name||!password||!username||!confirm) {
    return {
      error:'All Fields are required'
    };
  }
  if(confirm!==password){
    return {
      error:'Passwords do not match'
    };
  }
  const existingRoom=rooms.find((roomarr)=>{
    return roomarr.name===name;
  })
  if(existingRoom){
    return {
      error:'Room Name Already Exists'
    };
  }
  const roomarr={name,password}
  rooms.push(roomarr)
  return { roomarr } ;

}

const deleteRoom=(roomName)=>{
  const index=rooms.findIndex((roomArr)=>roomArr.name===roomName)
  if(index!==-1){
    rooms.splice(index,1)
  }
}

const addUser=({id,username,room,password})=>{
  username=username.trim().toLowerCase()
  room=room.trim().toLowerCase()
  password=password.trim().toLowerCase()
  if (!username||!room) {
    return {
      error:'Username and Room are required'
    }
  }

  const existingUser=users.find((user)=>{
     return user.room===room&&user.username===username
  })

  if(existingUser){
    return {
      error: 'Username in use'
    }
  }
  const checkForRoom=rooms.find((roomArr)=>{
    return roomArr.name===room;
  })
  if(!checkForRoom){
    return {
      error: 'Room Doesnt Exist'
    };
  }
  const correctPassword=rooms.find((roomarr)=>{
     return roomarr.name===room&&roomarr.password===password
  })
  if(!correctPassword){
    return {
      error:'Incorrect Password'
    };
  }

  const user={id,username,room}
  users.push(user)
  return { user } ;
}

const removeUser=(id)=>{
  const index=users.findIndex((user)=>user.id===id)       //it finds the index of element matching condition and returns it

  if (index!==-1) {
    return users.splice(index,1)[0]                        //it accepts the index and the number of element to be removed returning a array
  }
}

const getUser=(id)=>{
  const user=users.find((user)=>user.id===id)
  return user;
}
const getUsersInRoom=(room)=>{
  room.trim().toLowerCase()
  const usersInRoom=users.filter((user)=>user.room===room)
  return usersInRoom;
}

module.exports={
  addUser,
  removeUser,
  getUsersInRoom,
  getUser,
  createRoom,
  deleteRoom
}
