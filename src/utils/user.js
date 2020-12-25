var users=[];

const addUser=({id,username,room})=>{
  username=username.trim().toLowerCase()
  room=room.trim().toLowerCase()
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
  getUser
}
